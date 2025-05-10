import Joi from 'joi';

export const paginationSchema = Joi.object({
  q: Joi.string().min(1).required(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(10)
});
