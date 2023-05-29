import db from '../models'
const { SpinGame, Prize } = db
import { Request, Response, NextFunction } from 'express';

export const checkSpinGameExists = async (req : Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id
    let spinGame: any;
    let includeClause = {};
    if (
      req.method === 'GET' && req.path.includes('/spin-games/') ||
      req.method === 'PUT' && req.path.includes('/spin-games/')
    ) {
      includeClause = { include: [Prize] };
    }
    spinGame = await SpinGame.findByPk(id, { ...includeClause });
    if (!spinGame)
      throw { code: 404, message: 'SpinGame not found' }
    req.spinGame = spinGame
    next();
    // res.send(200)
  } catch (error) {
    next(error);
  }
}
