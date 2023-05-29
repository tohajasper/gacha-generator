if (process.env.NODE_ENV != "production") require("dotenv").config();
import express from 'express'; 
import cors from 'cors';
const app = express();
const port = process.env.PORT || 3000;
import indexRouter from './router/index';
import error from './helpers/error'

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', indexRouter);

app.use(error)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

export default app

