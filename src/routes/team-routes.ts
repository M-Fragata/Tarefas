import { Router } from "express";
import { TeamController } from "../controller/Team-Controller"

const teamRoutes = Router()
const teamController = new TeamController

teamRoutes.post("/", teamController.create)
teamRoutes.get("/", teamController.index)

export { teamRoutes }