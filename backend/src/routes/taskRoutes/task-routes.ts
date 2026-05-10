import { Router } from "express";
import { TaskController } from "../../controller/Task-Controller"
import { MemoController } from "../../controller/Memo-Controller";
import { GeneratePDFController } from "../../controller/GeneratePDF-Controller";

import { authenticated } from "../../middleware/authenticated"
import { authorizated } from "../../middleware/authorizated"

const taskRoutes = Router()
const taskController = new TaskController
const taskMemoController = new MemoController
const generatePDFController = new GeneratePDFController


taskRoutes.use(authenticated)

taskRoutes.post("/", authorizated(["admin"]), taskController.create)
taskRoutes.post("/memorando", authorizated(["user","admin"]), taskMemoController.generateTasks)
taskRoutes.post("/email", authorizated(["user","admin"]), generatePDFController.generate)
taskRoutes.get("/", authorizated(["user", "admin"]), taskController.index)
taskRoutes.get("/:userID", authorizated(["user", "admin"]), taskController.myTask)
taskRoutes.get("/details/:id", authorizated(["user", "admin"]), taskController.taskDetails)
taskRoutes.put("/:userID", authorizated(["user", "admin"]), taskController.update)
taskRoutes.delete("/:id", authorizated(["admin"]), taskController.remove)
taskRoutes.get("/status", authorizated(["user", "admin"]), taskController.status)
taskRoutes.get("/priority", authorizated(["user", "admin"]), taskController.priority)
taskRoutes.get("/historic/:id", authorizated(["user", "admin"]), taskController.historic)

export { taskRoutes }