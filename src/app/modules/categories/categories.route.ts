import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth";
import { UserRole } from "../user/user.interface";
import { validateRequest } from "../../middleware/validateRequest";
import { createCategorySchema, updateCategorySchema } from "./categories.validation";
import { categoryControllers } from "./categories.controller";

const router = Router();

router.post(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  validateRequest(createCategorySchema),
  categoryControllers.createCategory,
);


router.get(
  "/",
  checkAuth(UserRole.SUPERADMIN),
  categoryControllers.getAllCateogry,
);


router.get(
  "/:slug",
  checkAuth(UserRole.SUPERADMIN),
  categoryControllers.getSingleCategory,
);



router.patch(
  "/:id",
  checkAuth(UserRole.SUPERADMIN),
  validateRequest(updateCategorySchema),
  categoryControllers.updateCategory,
);


router.delete(
  "/:id",
  checkAuth(UserRole.SUPERADMIN),
  categoryControllers.deleteCategory,
);


export const CategoryRoutes = router
