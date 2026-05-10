import { Router } from "express";
import { CarenciaController } from "../../controller/carenciasController/CarenciaController";

const carenciaRoutes = Router()
const carenciaController = new CarenciaController

carenciaRoutes.get("/unidades", carenciaController.unidades)
carenciaRoutes.get("/boards", carenciaController.boards)
carenciaRoutes.post("/", carenciaController.carencia)
carenciaRoutes.get("/", carenciaController.index)

export { carenciaRoutes }