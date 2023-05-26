import { Joi } from "express-validation";
import { type UserCredentials } from "../../server/types.js";

const loginSchema = {
  body: Joi.object<UserCredentials>({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export default loginSchema;
