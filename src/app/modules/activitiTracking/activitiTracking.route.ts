import { Router } from "express";
import { UserRole } from "../user/user.interface";
import { activitiTrackingController } from "./activitiTracking.controller";
import { checkAuth } from "../../middleware/checkAuth";

const router = Router();

router.get(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  activitiTrackingController.getAllActivities,
);



export const ActivitiTrackingRoutes = router;