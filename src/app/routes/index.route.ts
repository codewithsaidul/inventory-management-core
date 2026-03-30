import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/categories/categories.route";
import { ProductRoutes } from "../modules/products/product.route";
import { OrderRoutes } from "../modules/order/order.route";


export const router = Router();

const modulesRoute = [
  {
    path: "/auth",
    route: AuthRoutes
  },
  {
    path: "/users",
    route: UserRoutes
  },
  {
    path: "/categories",
    route: CategoryRoutes
  },
  {
    path: "/products",
    route: ProductRoutes
  },
  {
    path: "/orders",
    route: OrderRoutes
  },
];

modulesRoute.forEach((route) => {
  router.use(route.path, route.route);
});
