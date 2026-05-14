import { Router } from "express";
import { SchoolsController } from "../../controller/schoolsController/SchoolsController";

const schoolsController = new SchoolsController()

const schoolsRoutes = Router()

schoolsRoutes.get("/unidades", schoolsController.unidades)

export { schoolsRoutes }