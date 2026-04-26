import request from "supertest"
import { app } from "../../app"
import { prisma } from "../../database/prisma"

describe("", () => {

    let token: string
    let user: any
    let id: string

    beforeAll(async () => {

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
        .send({userID: user.id, ...taskData})

        expect(response.status).toBe(201)

        id = response.body.id
    })

    it("shoud update status and priority", async () => {

        const response = await request(app)
        .put(`/tasks/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({priority: "Media", status: "Andamento"})

        expect(response.status).toBe(200)

    })

})