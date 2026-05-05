import { Router } from "express";
import { userRoutes } from "./user-routes";
import { teamRoutes } from "./team-routes"
import { taskRoutes } from "./task-routes"
import { memberRoutes } from "./member-routes"
import { ecidadeRoutes } from "./ecidade-routes"

const routes = Router()

routes.use("/users", userRoutes)
routes.use("/teams", teamRoutes)
routes.use("/tasks", taskRoutes)
routes.use("/members", memberRoutes)
routes.use("/ecidade", ecidadeRoutes)


export { routes }