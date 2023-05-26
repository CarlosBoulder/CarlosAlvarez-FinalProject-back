import { Router } from "express";
import { validate } from "express-validation";
import loginSchema from "../../../utils/schemas/loginSchema.js";
import { loginUser } from "../../controllers/user/userControllers.js";

const userRouter = Router();

userRouter.post(
  "/login",
  validate(loginSchema, {}, { abortEarly: false }),
  loginUser
);

export default userRouter;
