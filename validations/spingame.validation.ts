import { param, body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const validate = (validations: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    // if there is error then chain to main Error hanlder
    if (!errors.isEmpty()) {
      next({ ...errors, fromValidator: true });
    }

    next()
  };
};

const idParamsValidate = [param("id").isUUID().exists()];

const updateSpinGameValidate = [
  ...idParamsValidate,
  body("spinGameName").optional().isString(),
  body("prizes").optional().isArray(),
  // body("prizes.*.action")
  // .isIn(['create', 'update', 'delete']),
  // body("prizes.*.id")
  //   .if(body("prizes.*.action").isIn(['update', 'delete']))
  //   .isString(),
  body("prizes.*.name").isString(),
  body("prizes.*.probability").isFloat({ gt: 0, lt: 1 }),
];

export default {
  idParamsValidate: validate(idParamsValidate),
  updateSpinGameValidate: validate(updateSpinGameValidate),
};
