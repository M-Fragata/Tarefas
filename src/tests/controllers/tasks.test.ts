import request from "supertest"
import { app } from "../../app"
import { prisma } from "../../database/prisma"
import { UUID } from "node:crypto"

describe("", () => {

    let token: string
    let user: any
    let task: any

    beforeAll(async () => {

        const task = await prisma.task.findFirst({
            where: {title: "Tarefa de Teste"}
        })

        await prisma.taskLog.deleteMany({
            where: { taskID: task?.id}
        });

        await prisma.task.deleteMany({
            where: {id: task?.id}
        })

        //Usuário com role de ADMIN
        const login = await request(app).post("/users/login").send({
            email: "admin@gmail.com",
            password: "m4th3us1"
        })

        token = login.body.token
        user = login.body.userWithoutPassword
    })

    const taskData = {
        title: "Tarefa de Teste",
        description: "Objetivo da tarefa é criar teste",
        priority: "Baixa"
    }

    it("Should create a task", async () => {

        const response = await request(app)
            .post("/tasks/")
            .set("Authorization", `Bearer ${token}`)
            .send({ userID: user.id, ...taskData })

        task = await prisma.task.findFirst({
            where: {
                title: "Tarefa de Teste"
            }
        })

        expect(response.status).toBe(201)

    })

    it("shoud update status and priority", async () => {

        const response = await request(app)
            .put(`/tasks/${task.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ priority: "Media", status: "Concluida" })

        expect(response.status).toBe(200)

    })


})