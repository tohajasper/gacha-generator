import db from '../models'
const { SpinGame, Prize, SpinGameHistory } = db
import { NextFunction } from 'express';
import { CreateSpinGameDTO, UpdateSpinGameDTO } from './types/service.types';

export default class Service {

  static async createSpinGame({ name } : CreateSpinGameDTO, next: NextFunction) {
    try {
      const newSpinGame = await SpinGame.create({
        name
      });
      return newSpinGame;
    } catch (error) {
      next(error)
    }
  }

  static async updateSpinGame(spinGame: any, { spinGameName, prizes }: UpdateSpinGameDTO, next: NextFunction) {
    try {
      if (spinGameName) await spinGame.update({ name: spinGameName });

      if (prizes && prizes.length) {
        // cast the probability to number here since decimal isnt really available in JS so sequelize return it as string instead; source:https://github.com/sequelize/sequelize/issues/8019
        const totalCurrentProbabilityRatio = spinGame.Prizes.reduce((acc: number, curr: { probability: any; }) => acc + Number(curr.probability), 0)
        const totalNewProbabilityRatio = prizes.reduce((acc, curr) => acc + curr.probability, 0)

        if (totalCurrentProbabilityRatio + totalNewProbabilityRatio > 1)
          throw {
            code: 403,
            message: 'Not allowing total probability to exceed 100%'
          }
        const newPrizes = prizes.map(prize => {
          return {
            ...prize,
            spin_game_id: spinGame.id
          }
        })
        await Prize.bulkCreate(newPrizes)
      }
      return true;
    } catch (error) {
      next(error)
    }
  }

  static async deleteSpinGame(spinGame: any, next: NextFunction) {
    try {
      await spinGame.destroy()
      return true
    } catch (error) {
      next(error)
    }
  }

  static async spinLastGame(next: NextFunction) {
    try {
      const lastSpinGame = await SpinGame.findOne({ 
        include: [{ 
          model: Prize,
        }],
        order: [
          ['updatedAt', 'desc'],
          [Prize, 'probability', 'asc']
        ], 
      })
      if (!lastSpinGame || !lastSpinGame.Prizes.length)
        throw { code: 404, message: 'No spin game has been created or completed' }
      const roll = Math.random()

      let prize = null;
      let totalPrevProbability = 0
      for(let i = 0; i < lastSpinGame.Prizes.length; i++) {
        if(i !== 0) totalPrevProbability += Number(lastSpinGame.Prizes[i-1].probability);
        const currentProbability = Number(lastSpinGame.Prizes[i].probability);
        if(currentProbability+totalPrevProbability > roll) {
          prize = lastSpinGame.Prizes[i]
          break;
        }
      }

      await this.saveGameHistory(roll, prize) // save play history

      return { yourRoll: roll, yourPrize: prize?.name || 'You got no prize.. , Try Again!'}
    } catch (error) {
      next(error)
    }
  }

  static async saveGameHistory(roll: number, prize: any){
    try {
      await SpinGameHistory.create({ roll, prize_data: prize })
    } catch (error) {
      throw error
    }
  }
}