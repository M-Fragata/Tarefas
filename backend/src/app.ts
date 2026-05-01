import express from "express"
import { routes } from "./routes/index"
import { ErrorHandle } from "./middleware/ErrorHandle"
import cors from 'cors';

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)

app.use(ErrorHandle)

export { app }