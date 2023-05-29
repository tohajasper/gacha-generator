const expect = require("chai").expect;
import Service from '../../services';
import db from '../../models'
const { SpinGame, Prize, SpinGameHistory } = db
import sinon from "sinon";

describe("Testing Spin Games Service", () => {
  let next = () => { }
  let mockSpinGameData = {
    id: 'mockId',
    name: 'mockName',
    Prizes: [
      {
        name: 'gold',
        probability: 0.23
      }
    ],
    update: () => { },
    destroy: () => { }
  }
  const mockSpinGame = sinon.mock(SpinGame)
  const mockPrize = sinon.mock(Prize)
  const mockGameHistory = sinon.mock(SpinGameHistory)

  afterEach(async () => {
    mockSpinGame.verify()
    mockPrize.verify()
    mockGameHistory.verify()
  })

  describe('mock createSpinGame', () => {

    it('should create and return SpinGame', async () => {
      mockSpinGame.expects("create").exactly(1).withExactArgs({ name: 'mockName' }).resolves(mockSpinGameData)
      const output = await Service.createSpinGame({ name: 'mockName' }, next)
      expect(output).to.deep.equal(mockSpinGameData)
    })
  })

  describe('mock updateSpinGame', () => {

    it('should update SpinGame', async () => {
      const updatedSpinGameMockData = {
        ...mockSpinGameData,
        name: 'mockName1',
        prizes: [{
          name: 'piano',
          probability: 0.55
        }]
      }
      sinon.mock(mockSpinGameData).expects("update")
        .exactly(1)
        .withExactArgs({ name: updatedSpinGameMockData.name })
      mockPrize.expects("bulkCreate")
        .exactly(1)
      const output = await Service.updateSpinGame(mockSpinGameData, {
        spinGameName: updatedSpinGameMockData.name,
        prizes: updatedSpinGameMockData.prizes
      }, next)
      expect(output).to.be.true
      sinon.mock(mockSpinGameData).verify()
    })
  })

  describe('mock deleteSpinGame', () => {

    it('should create and return SpinGame', async () => {
      sinon.mock(mockSpinGameData).expects("destroy").exactly(1).withExactArgs()
      const output = await Service.deleteSpinGame(mockSpinGameData, next)
      expect(output).to.deep.be.true
      sinon.mock(mockSpinGameData).verify()
    })
  })

  describe('mock saveGameHistory', () => {

    it('should create SpinGameHistory', async () => {
      const roll = Math.random()
      const prize = mockSpinGameData.Prizes[0]
      mockGameHistory.expects("create").exactly(1).withExactArgs({ roll, prize_data: prize })
      await Service.saveGameHistory(roll, prize)
    })
  })

  describe('mock spinLastGame', () => {

    it('should find the last created game and save the game result', async () => {
      mockSpinGame.expects("findOne").exactly(1).withExactArgs({
        include: [{
          model: Prize,
        }],
        order: [
          ['updatedAt', 'desc'],
          [Prize, 'probability', 'asc']
        ],
      }).resolves(mockSpinGameData)
      sinon.mock(Service).expects("saveGameHistory").exactly(1)
      await Service.spinLastGame(next)
    })
  })
})

