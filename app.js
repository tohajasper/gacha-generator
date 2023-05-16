if (process.env.NODE_ENV != "production") require("dotenv").config();
const express = require('express'); 
const app = express();
const port = process.env.PORT || 3000;
const cors = require('cors');
const indexRouter = require('./router/index');
const error = require('./helpers/error')

app.use(cors());
// app.use(logger('dev'));
// const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/', indexRouter);

app.use(error)

if (process.env.NODE_ENV === "test") module.exports = app
else app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

