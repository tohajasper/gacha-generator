const { param, body, validationResult } = require('express-validator');

const validationHandler = async (req, res, next) => {
  const errors = validationResult(req);
  // if there is error then chain to main Error hanlder
  if (!errors.isEmpty()) {
    next({ ...errors, fromValidator: true })
  }
  next()
}

const idParamsValidate = [
  param("id")
    .isUUID()
    .exists()
]

const updateSpinGameValidate = [
  ...idParamsValidate,
  body("spinGameName")
    .optional()
    .isString(),
  body("prizes").optional().isArray(),
  // body("prizes.*.action")
    // .isIn(['create', 'update', 'delete']),
  // body("prizes.*.id")
  //   .if(body("prizes.*.action").isIn(['update', 'delete']))
  //   .isString(),
  body("prizes.*.name")
    .isString(),
  body("prizes.*.probability")
    .isFloat({ gt: 0, lt: 1 }),
]

module.exports = {
  idParamsValidate: [idParamsValidate, validationHandler],
  updateSpinGameValidate: [updateSpinGameValidate, validationHandler],
}