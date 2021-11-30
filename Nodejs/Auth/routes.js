import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resetPassword,
  verifyResetPasswordLink,
  changePassword,
} from "./controller";
import {
  checkResetPasswordLink,
  isAuthorizedToChangePassword,
} from "./middleware";

const router = Router();

/* 
  *Auth Routes 
*/
router.post("/login", login);
router.post("/register", register);
router.post("/forgot-password", forgotPassword);
router.get("/verify-link", verifyResetPasswordLink);
router.post("/reset-password", checkResetPasswordLink, resetPassword);
router.post("/change-password", isAuthorizedToChangePassword, changePassword);

export { router };
