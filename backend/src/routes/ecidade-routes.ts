import { Router } from "express";
import { EcidadeController } from "../controller/EcidadeController";

const ecidadeRoutes = Router()
const ecidadeController = new EcidadeController

ecidadeRoutes.post("/", ecidadeController.movimentar)

export { ecidadeRoutes }

