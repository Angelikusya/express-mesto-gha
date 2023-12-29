const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const helmet = require('helmet');

const { router } = require('./routes');

const app = express();
const {
  PORT = 3000,
  MONGO_URL = 'mongodb://localhost:27017/mestodb',
} = process.env; // Слушаем 3000 порт, подключаем базу данных

mongoose.connect(`${MONGO_URL}`)
  .then(() => console.log('база данных подключена'))
  .catch((err) => console.error(err));

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(helmet());
app.use(router);

app.use(errors());
// app.use(errorHandler);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
