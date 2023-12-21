const express = require('express');
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

app.use((req, res, next) => {
  req.user = {
    _id: '6582cb6777372dd5dba31a9f',
  };
  next();
});
app.use(helmet());
app.use(router);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`);
});
