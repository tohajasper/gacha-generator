const express = require('express');
const route = express.Router()
const Controller = require('../controllers/index');
const checkSpinGameExists = require('../middleware/checkSpinGame');
// const validationHandler = require('../middleware/validationHandler')
const { idParamsValidate, updateSpinGameValidate } = require('../validations/spingame.validation');

route.post('/spin-games', Controller.createSpinGame);
route.post('/spin', Controller.spinLastGame);

route.get('/spin-games/:id', idParamsValidate, checkSpinGameExists, Controller.getSpinGame);
route.put('/spin-games/:id', updateSpinGameValidate, checkSpinGameExists, Controller.updateSpinGame);
route.delete('/spin-games/:id', idParamsValidate, checkSpinGameExists, Controller.deleteSpinGame);

module.exports = route