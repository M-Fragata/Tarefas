import { Router } from "express";
import { TaskController } from "../controller/Task-Controller"

import { authenticated } from "../middleware/authenticated"
import { authorizated } from "../middleware/authorizated"

const taskRoutes = Router()
const taskController = new TaskController

taskRoutes.use(authenticated)

taskRoutes.post("/", authorizated(["admin"]),taskController.create)
taskRoutes.get("/", authorizated(["user","admin"]), taskController.index)
taskRoutes.put("/:id", authorizated(["user","admin"]), taskController.update)
taskRoutes.delete("/:id", authorizated(["user","admin"]), taskController.remove)
taskRoutes.get("/status", authorizated(["user","admin"]), taskController.status)
taskRoutes.get("/priority", authorizated(["user","admin"]), taskController.priority)
taskRoutes.get("/historic/:id", authorizated(["user","admin"]), taskController.historic)

export { taskRoutes }