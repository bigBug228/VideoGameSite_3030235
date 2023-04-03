const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/user');

const NotFoundError = require('../errors/NotFoundError');

const { JWT_SECRET, SALT_ROUND } = require('../config');

const CastError = require('../errors/CastError');

const ConflictError = require('../errors/ConflictError');

const ValidationError = require('../errors/ValidationError');

const AuthError = require('../errors/AuthError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.json(users); 
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден!');
    })
    .then((user) => {
      res
        .status(200)
        .send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Невалидный id пользователя'));
      }
      next(err);
    });
};

const postUser = (req, res, next) => {
  const {name, email, password} = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользватель с таким email или паролем уже зарегистрирован!');
      }
      return bcrypt.hash(password, SALT_ROUND);
    })
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then(() => res.status(201).send({ message: `Аккаунт пользователя ${email} успешно создан!` }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные!'));
      }
      next(err);
    });
};
const deleteUser = (req, res, next) => {
  User.findByIdAndDelete(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send({ message: 'User deleted successfully' });
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id).then((user) => {
    if (user) {
      return res.status(200).send(user);
    }
    throw new NotFoundError('Пользователь с таким id не найден!');
  })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Некорректные данные!'));
      }
      next(err);
    });
};
const editUser = (req, res, next) => {
  const { userId } = req.params;
  const { name, email, isAdmin } = req.body;

  User.findByIdAndUpdate(userId, { name, email, isAdmin })
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(next);
};
const changeUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('User not found!');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Некорректные данные!'));
      }
      next(err);
    });
};

const changeAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден!');
    })
    .then((userAvatar) => res.status(200).send(userAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Hекорректные данные!'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .orFail(() => {
      throw new AuthError('Не правильные имя пользователя или пароль!');
    });

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if(user.email=="aivanzhukov28@gmail.com"){
        user.isAdmin =true;
        user.save();
      }
      const token = jwt.sign(
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' },
      );
      res.send({ token, id: user._id,isAdmin: user.isAdmin,name:user.name });
    })
    .catch(next);
};

module.exports = {
  postUser,
  getCurrentUser,
  getUsers,
  getUser,
  changeUser,
  changeAvatar,
  login,
  deleteUser,
  editUser
};
