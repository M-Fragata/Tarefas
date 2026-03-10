import { Router } from "express";
import { TaskController } from "../controller/Task-Controller"

import { authenticated } from "../middleware/authenticated"
import { authorizated } from "../middleware/authorizated"

const taskRoutes = Router()
const taskController = new TaskController

taskRoutes.use(authenticated)

taskRoutes.post("/", authorizated(["admin"]),taskController.create)
taskRoutes.get("/", authorizated(["user","admin"]), taskController.index)

export { taskRoutes }