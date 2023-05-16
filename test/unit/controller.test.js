const expect = require("chai").expect;
const Service = require('../../services')
const Controller = require('../../controllers')
const sinon = require("sinon")

describe("Testing Spin Games Controller", () => {
  let request = {
    body: {},
    spinGame: {
      id: 'mockId'
    }
  }
  let response = {
    status: () => { },
    send: () => { }
  }
  let next = () => { }
  const spy = sinon.spy(response)
  const mock = sinon.mock(Service)

  afterEach(async () => {
    spy.status.resetHistory()
    spy.send.resetHistory()
    mock.verify()
  })

  describe('mock createSpinGame', () => {

    it('should called service createSpinGame', async () => {
      mock.expects("createSpinGame").exactly(1).withExactArgs(request.body, next)
      await Controller.createSpinGame(request, response, next)
      expect(spy.status.calledOnce).to.be.true
      expect(spy.status.calledWithExactly(201)).to.be.true
      expect(spy.send.calledOnce).to.be.true
      expect(spy.send.calledWithExactly({ SpinGame: undefined })).to.be.true
    })
  })

  describe('mock getSpinGame', () => {

    it('should res.send the spin game', async () => {
      await Controller.getSpinGame(request, response, next)
      expect(spy.send.calledOnce).to.be.true
      expect(spy.send.calledWithExactly({ SpinGame: request.spinGame })).to.be.true
    })
  })

  describe('mock updateSpinGame', () => {

    it('should called service updateSpinGame', async () => {
      mock.expects("updateSpinGame").exactly(1).withExactArgs(request.spinGame, request.body, next)
      await Controller.updateSpinGame(request, response, next)
      expect(spy.send.calledOnce).to.be.true
      expect(spy.send.calledWithExactly({ message: 'SpinGame updated successfully' })).to.be.true
    })
  })

  describe('mock deleteSpinGame', () => {

    it('should called service deleteSpinGame', async () => {
      mock.expects("deleteSpinGame").exactly(1).withExactArgs(request.spinGame, next).resolves(true)
      await Controller.deleteSpinGame(request, response, next)
      expect(spy.send.calledOnce).to.be.true
      expect(spy.send.calledWithExactly({ message: `SpinGame with id "mockId" was deleted`})).to.be.true
      // sinon.assert.calledOnceWithExactly(spy.send, { message: `SpinGame with id "mockId" was deleted`})
    })
  })

  describe('mock spinLastGame', () => {

    it('should called service spinLastGame', async () => {
      mock.expects("spinLastGame").exactly(1).withExactArgs(next)
      await Controller.spinLastGame(request, response, next)
      expect(spy.send.calledOnce).to.be.true
      expect(spy.send.calledWithExactly({ SpinGame: undefined })).to.be.true
    })
  })
})

