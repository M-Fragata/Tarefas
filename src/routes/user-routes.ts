import { Router } from "express";
import { UserController } from "../controller/User-Controller"

import { authenticated } from "../middleware/authenticated";
import { authorizated } from "../middleware/authorizated";

const userRoutes = Router()
const userController = new UserController

userRoutes.get("/", userController.index)
userRoutes.post("/", userController.create)
userRoutes.post("/login", userController.login)

userRoutes.use(authenticated, authorizated(["admin"]))

userRoutes.put("/:id", userController.put)
userRoutes.delete("/:id", userController.remove)


export { userRoutes }