import { Request, Response } from "express";

export default (err: any, req: Request, res: Response, next: any) => {
  console.log('====================================');
  console.log(err);
  console.log('====================================');

  if (err.fromValidator) {
    return res.status(400).json({
      status: 400,
      message: `Validation failed`,
      errors: err.errors,
    });
  } else if (err.code) {
    res.status(err.code).json({
      status: err.code,
      message: err.message,
    });
  } else if (err.name === 'SequelizeValidationError') {
    let messages = [];
    for (let error in err.errors) {
      messages.push(err.errors[error].message)
    }
    res.status(400).json({
      status: 400,
      messages,
    });
  }else if(err.name === 'ParameterMissingError'){
    res.status(400).json({
      status: 400,
      message: err.message
    })
  } else {
    res.status(500).json({
      status: 500,
      message: 'Internal Server Error',
    });
  }
};
