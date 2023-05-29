import express, { RequestHandler } from 'express';
import Controller from '../controllers/index';
import { checkSpinGameExists } from '../middleware/checkSpinGame';

const route = express.Router()
import validate from '../validations/spingame.validation';

route.post('/spin-games', Controller.createSpinGame);
route.post('/spin', Controller.spinLastGame);

route.get('/spin-games/:id', validate.idParamsValidate, checkSpinGameExists, Controller.getSpinGame);
route.put('/spin-games/:id', validate.updateSpinGameValidate, checkSpinGameExists, Controller.updateSpinGame);
route.delete('/spin-games/:id', validate.idParamsValidate, checkSpinGameExists, Controller.deleteSpinGame);

export default route