const express = require('express');
//Это чтобы проверять можно было с сайта на сервер в режиме npm run serve
//То есть надо расскомментировать это чтобы проверить как работает без раздачи
//статических файлов с сервера и еще к этому с 32 по 41 строчку тоже раскомментировать
const cors = require('cors');

const { celebrate, Joi, errors } = require('celebrate');

const mongoose = require('mongoose');
const Post = require('./models/post');

const bodyParser = require('body-parser');

const routesUsers = require('./routes/users');

const routesPosts = require('./routes/posts');

const { postUser, login } = require('./controllers/users');

const { requestLogger, errorLogger } = require('./midlewares/Logger');

const { auth } = require('./midlewares/auth');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;

// const { PORT = 4000 } = process.env;

const app = express();
// Это я пока тестировал так записал, чтобы не копировать туда-обратно)
 app.use(express.static('../frontend/dist'));
// app.set('view engine', 'ejs');
// app.get('/', (req, res) => {
//   res.render('index');
// });
//Это чтобы проверять можно было с сайта на сервер в режиме npm run serve
app.use(cors());

//Это чтобы проверять можно было с сайта на сервер в режиме npm run serve
const allowCrossDomain = function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
app.use(allowCrossDomain);

mongoose.connect('mongodb://localhost:27017/AssignmentDatabase', {
  useNewUrlParser: true,
});

app.use(bodyParser.json());

app.use(requestLogger);

app.get('api/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/api/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  postUser,
);
app.post(
  '/api/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);
app.get('/api/getPosts',(req,res) => {
  Post.find({})
    .then((posts) => {
      res.status(200).send(posts);
    })
});
app.use(auth);
app.use('/api/users', routesUsers);
app.use('/api/posts', routesPosts);
app.use('*', () => {
  throw new NotFoundError('Запрашиваемая страница не существует!');
});
app.use(errorLogger);
app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : `Произошла ошибка: ${message}`,
    });
  next();
});


app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
