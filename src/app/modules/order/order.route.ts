import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { orderValidationSchema } from "./order.validation";
import { orderControllers } from "./order.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  validateRequest(orderValidationSchema),
  orderControllers.createOrder,
);



router.get(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  orderControllers.getAllOrders,
);


router.patch(
  "/:id/status",
  checkAuth(UserRole.SUPERADMIN),
  orderControllers.updateOrderStatus,
);


router.delete(
  "/:id",
  checkAuth(UserRole.SUPERADMIN),
  orderControllers.deleteOrder,
);

export const OrderRoutes = router;
