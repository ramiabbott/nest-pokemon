import * as Joi from 'joi';

export const JoiValidationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    MONGODB: Joi.string().required(),
    NODE_ENV: Joi.string().valid('dev', 'prod').default('dev'),
    DEFAULT_LIMIT: Joi.number().default(5),
    });