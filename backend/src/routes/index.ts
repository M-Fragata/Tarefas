import { Router } from "express";
import { userRoutes } from "./taskRoutes/user-routes";
import { teamRoutes } from "./taskRoutes/team-routes"
import { taskRoutes } from "./taskRoutes/task-routes"
import { memberRoutes } from "./taskRoutes/member-routes"
import { ecidadeRoutes } from "./taskRoutes/ecidade-routes"

import { carenciaRoutes } from "./carenciaRoutes/carencia-routes"

const routes = Router()

//Tasks
routes.use("/users", userRoutes)
routes.use("/teams", teamRoutes)
routes.use("/tasks", taskRoutes)
routes.use("/members", memberRoutes)
routes.use("/ecidade", ecidadeRoutes)

//Carencias
routes.use("/carencias", carenciaRoutes)


export { routes }