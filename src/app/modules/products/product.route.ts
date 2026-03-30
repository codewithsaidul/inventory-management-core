import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { productValidationSchema, updateProductValidation } from "./products.validation";
import { productControllers } from "./product.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  validateRequest(productValidationSchema),
  productControllers.createProduct,
);


router.get(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  productControllers.getAllProduct,
);


router.get(
  "/:slug",
  checkAuth(UserRole.SUPERADMIN),
  productControllers.getProductDetails,
);


router.patch(
  "/:id",
  checkAuth(UserRole.SUPERADMIN),
  validateRequest(updateProductValidation),
  productControllers.updateProduct,
);


router.delete(
  "/:id",
  checkAuth(UserRole.SUPERADMIN),
  productControllers.deleteProduct,
);

export const ProductRoutes = router;
