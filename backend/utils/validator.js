const { Joi } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const createCardSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required().custom(validateURL),
  }),
};

const updateAvatarSchema = {
  body: Joi.object().keys({
    avatar: Joi.string().required().custom(validateURL),
  }),
};

const updateUserSchema = {
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
};

module.exports = {
  createCardSchema,
  updateAvatarSchema,
  updateUserSchema,
};
