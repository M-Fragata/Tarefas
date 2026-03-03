import { Router } from "express";
import { TaskController } from "../controller/Task-Controller"

const taskRoutes = Router()
const taskController = new TaskController

taskRoutes.post("/", taskController.create)
taskRoutes.get("/", taskController.index)

export { taskRoutes }