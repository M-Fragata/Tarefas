import { app } from "./app";

const Port = process.env.PORT

app.listen(Port, () => {
    console.log("server is running on PORT:", Port)
})