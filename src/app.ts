import express from "express"
import { routes } from "./routes"
import { ErrorHandle } from "./middleware/ErrorHandle"

const app = express()


app.use(express.json())
app.use(routes)

app.use(ErrorHandle)

export { app }