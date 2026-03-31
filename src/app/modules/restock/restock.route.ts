import { Router } from "express";
import { restockController } from "./restock.controller";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";

export const router = Router();

router.get(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  restockController.getAllRestockQueues,
);

export const RestockQueueRoutes = router;
