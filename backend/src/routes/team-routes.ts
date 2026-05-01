import { Router } from "express";
import { TeamController } from "../controller/Team-Controller"

import { authenticated } from "../middleware/authenticated"
import { authorizated } from "../middleware/authorizated"

const teamRoutes = Router()
const teamController = new TeamController

teamRoutes.use(authenticated, authorizated(["admin"]))

teamRoutes.post("/", teamController.create)
teamRoutes.get("/", teamController.index)
teamRoutes.delete("/:id", teamController.remove)
teamRoutes.put("/:id", teamController.update)

export { teamRoutes }