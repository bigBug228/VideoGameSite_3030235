const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { sampleUrl } = require('../config');

const {
  getUsers,
  getUser,
  changeUser,
  getCurrentUser,
  changeAvatar,
  deleteUser,
  editUser
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getCurrentUser);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUser,
);
router.delete(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  deleteUser,
);
router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().pattern(sampleUrl).required(),
    }),
  }),
  changeAvatar,
);
router.post(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      isAdmin: Joi.boolean().required()
    }),
  }),
  editUser
);
router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
  }),
  changeUser,
);

module.exports = router;
