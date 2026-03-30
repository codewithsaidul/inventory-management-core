import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { UserRole } from "../user/user.interface";
import { createUserZodSchema } from "../user/user.validation";


const router = Router();

router.post(
  "/register",
  validateRequest(createUserZodSchema),
  AuthController.createUser
);
router.post("/login", AuthController.credentialsLogin);
router.post("/refresh-token", AuthController.getNewAccessToken);
router.post("/logout", AuthController.logout);


router.get(
  "/me",
  checkAuth(...Object.values(UserRole)),
  AuthController.getMe
);



export const AuthRoutes = router;
