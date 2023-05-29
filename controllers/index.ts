import Service from '../services'
import { Request, Response, NextFunction } from "express"

export default class Controller {
  static async createSpinGame(req : Request, res: Response, next: NextFunction) {
    const input = req.body
    try {
      const newSpinGame = await Service.createSpinGame(input ,next)
      res.status(201)
      res.send({ SpinGame: newSpinGame })
    } catch (error) {
      next(error)
    }
  }

  static async getSpinGame(req : Request, res: Response, next: NextFunction) {
    const spinGame = req.spinGame
    try {
      res.send({ SpinGame: spinGame })
    } catch (error) {
      next(error)
    }
  }

  static async updateSpinGame(req : Request, res: Response, next: NextFunction) {
    const spinGame = req.spinGame
    const spinGameData = req.body
    try {
      await Service.updateSpinGame(spinGame, spinGameData, next)
      res.send({ message: 'SpinGame updated successfully' })
    } catch (error) {
      next(error)
    }
  }

  static async deleteSpinGame(req : Request, res: Response, next: NextFunction) {
    const spinGame = req.spinGame
    try {
      const deleted = await Service.deleteSpinGame(spinGame ,next)
      if (deleted) return res.send({ message: `SpinGame with id "${spinGame.id}" was deleted`})
      res.send({ message: 'SpinGame not found'}) // shouldn't happen
    } catch (error) {
      next(error)
    }
  }

  static async spinLastGame(req : Request, res: Response, next: NextFunction) {
    try {
      const SpinGame = await Service.spinLastGame(next)
      res.send({ SpinGame })
    } catch (error) {
      next(error)
    }
  }
}
