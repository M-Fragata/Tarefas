import { Router } from "express";
import { MemberController } from "../controller/member-controller"

import { authenticated } from "../middleware/authenticated";
import { authorizated } from "../middleware/authorizated";

const memberRoutes = Router()

const memberController = new MemberController()

memberRoutes.use(authenticated, authorizated(["admin"]))

memberRoutes.put("/:teamID/adicionar", memberController.adicionar)
memberRoutes.put("/:userID/remover", memberController.remover)

export { memberRoutes }