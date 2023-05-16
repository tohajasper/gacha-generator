const expect = require("chai").expect;
const request = require("supertest");
const { SpinGame, Prize, SpinGameHistory } = require("../../models");
const app = require("../../app");

let spinGameId = '';

describe("Testing Spin Games Endpoint", () => {
  beforeEach(async () => {
    try {
      const spinGame = await SpinGame.create({ name: 'gacha1'})
      spinGameId = spinGame.id
      await Prize.create({ name: 'piano', probability: 0.35, spin_game_id: spinGameId})
      
    } catch (error) {
      console.log(error);
    }
  })

  afterEach(async () => {
    try {
      await SpinGame.destroy({
        where: {},
        truncate: { cascade: true },
        force: true
      })
    } catch (error) {
      console.log(error);
    }
  })
  
  describe("post /spin-games", () => {
    it("should create a spin game", async () => {
      const res = await request(app)
        .post("/spin-games")
        .send({
          name: "gacha2",
        });
      const data = res.body;
      expect(res.status).to.equal(201);
      expect(data).to.have.property("SpinGame");
      expect(data.SpinGame).to.have.property("id").that.is.a('string');
      expect(data.SpinGame).to.have.property("name", "gacha2");
  
      const spinGame = await SpinGame.findOne({ where: { name: 'gacha2' }});
      expect(spinGame.name).to.equal('gacha2');
    })
  })
  
  describe("get /spin-games/:id", () => {
    it("should return a spin game if valid id is passed", async () => {
      const res = await request(app)
        .get("/spin-games/" + spinGameId)
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("SpinGame");
      expect(data.SpinGame).to.have.property("id").that.is.a('string');
      expect(data.SpinGame).to.have.property("name", "gacha1");
      expect(data.SpinGame).to.have.property("Prizes");
      expect(data.SpinGame.Prizes[0]).to.have.property("id").that.is.a('string')
      expect(data.SpinGame.Prizes[0]).to.have.property("name", "piano")
      expect(data.SpinGame.Prizes[0]).to.have.property("probability", "0.35")
  
      const spinGame = await SpinGame.findByPk(spinGameId);
      expect(spinGame.name).to.equal('gacha1');
    })

    it("should not return a spin game if invalid id is passed", async () => {
      const res = await request(app)
        .get("/spin-games/" + "abc123")
      const data = res.body;
      expect(res.status).to.equal(400);
      expect(data).to.have.property("error");
      expect(data.error[0]).to.have.property("msg", "Invalid value")
      expect(data.error[0]).to.have.property("location", "params")
    })

    it("should not return a spin game if already deleted", async () => {
      await SpinGame.destroy({ where: { id: spinGameId }})
      const res = await request(app)
        .get("/spin-games/" + spinGameId)
      const data = res.body;
      expect(res.status).to.equal(404);
      expect(data).to.have.property("message", "SpinGame not found");
    })
  })

  describe("put /spin-games/:id", () => {
    it("should update the existing spin game with updated name", async () => {
      const res = await request(app)
        .put("/spin-games/" + spinGameId)
        .send({
          spinGameName: "gacha3",
        });
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("message", "SpinGame updated successfully");
  
      const spinGame = await SpinGame.findByPk(spinGameId);
      expect(spinGame.name).to.equal('gacha3');
    })

    it("should update the existing spin game with new prizes", async () => {
      const res = await request(app)
        .put("/spin-games/" + spinGameId)
        .send({
          prizes: [
            { name: 'phone', probability: 0.315 },
            { name: 'gold', probability: 0.15 },
          ]
        });
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("message", "SpinGame updated successfully");
  
      const spinGame = await SpinGame.findByPk(spinGameId, { include: [Prize]});
      expect(spinGame.Prizes.length).to.eql(3);
      expect(spinGame.Prizes.map(el=>(el.name))).to.include("phone");
      expect(spinGame.Prizes.map(el=>(el.probability))).to.include("0.315");
      expect(spinGame.Prizes.map(el=>(el.name))).to.include("gold");
      expect(spinGame.Prizes.map(el=>(el.probability))).to.include("0.15");
      expect(spinGame.Prizes.map(el=>(el.name))).to.include("piano");
      expect(spinGame.Prizes.map(el=>(el.probability))).to.include("0.35");
    })

    it("should not update the existing spin game with prizes exceeding 100%", async () => {
      const res = await request(app)
        .put("/spin-games/" + spinGameId)
        .send({
          prizes: [
            { name: 'phone', probability: 0.315 },
            { name: 'gold', probability: 0.55 },
          ]
        });
      const data = res.body;
      expect(res.status).to.equal(403);
      expect(data).to.have.property("message", "Not allowing total probability to exceed 100%");
  
      const spinGame = await SpinGame.findByPk(spinGameId, { include: [Prize]});
      expect(spinGame.Prizes.length).to.eql(1);
    })
  })

  describe("delete /spin-games/:id", () => {
    it("should delete the existing spin game", async () => {
      const res = await request(app)
        .delete("/spin-games/" + spinGameId)
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("message", `SpinGame with id "${spinGameId}" was deleted`);
  
      const spinGame = await SpinGame.findByPk(spinGameId);
      expect(spinGame).to.be.null;
    })
  })

  describe("post /spin", () => {
    it("should return the last created spin game result and record it", async () => {
      await Prize.create({ name: 'watch', probability: 0.40, spin_game_id: spinGameId})
      await Prize.create({ name: 'gold', probability: 0.25, spin_game_id: spinGameId})

      const res = await request(app)
        .post("/spin")
      const data = res.body;
      expect(res.status).to.equal(200);
      expect(data).to.have.property("SpinGame");
      expect(data.SpinGame).to.have.property("yourRoll").that.is.a("number");
      expect(data.SpinGame).to.have.property("yourPrize").that.is.a("string");
  
      const history = await SpinGameHistory.findOne({ order: [['createdAt', 'desc']]});
      expect(history).to.have.property("roll", String(data.SpinGame.yourRoll));
      expect(history).to.have.property("prize_data").that.is.a("object")
    })

    it("should not be allowed to play with game that isn't completed", async () => {
      await Prize.destroy({ where : { name: 'piano'}})

      const res = await request(app)
        .post("/spin")
      const data = res.body;
      expect(res.status).to.equal(404);
      expect(data).to.have.property("message",'No spin game has been created or completed');
    })
  })

})

