const { SpinGame, Prize, SpinGameHistory } = require('../models');

class Service {

  static async createSpinGame({ name }, next) {
    try {
      const newSpinGame = await SpinGame.create({
        name
      });
      return newSpinGame;
    } catch (error) {
      next(error)
    }
  }

  // static async getSpinGame(spinGame, next) { // optional 
  //   try {
  //     return spinGame;
  //   } catch (error) {
  //     next(error)
  //   }
  // }

  static async updateSpinGame(spinGame, { spinGameName, prizes }, next) {
    try {
      if (spinGameName) await spinGame.update({ name: spinGameName });

      if (prizes && prizes.length) {
        // cast the probability to number here since decimal isnt really available in JS so sequelize return it as string instead; source:https://github.com/sequelize/sequelize/issues/8019
        const totalCurrentProbabilityRatio = spinGame.Prizes.reduce((acc, curr) => acc + Number(curr.probability), 0)
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

  static async deleteSpinGame(spinGame, next) {
    try {
      await spinGame.destroy()
      return true
    } catch (error) {
      next(error)
    }
  }

  static async spinLastGame(next) {
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

      await this.saveGameHistory(roll, prize, lastSpinGame) // save play history

      return { yourRoll: roll, yourPrize: prize?.name || 'You got no prize.. , Try Again!'}
    } catch (error) {
      next(error)
    }
  }

  static async saveGameHistory(roll, prize){
    try {
      await SpinGameHistory.create({ roll, prize_data: prize })
    } catch (error) {
      throw error
    }
  }
}

module.exports = Service