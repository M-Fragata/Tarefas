import request from "supertest"
import { app } from "../../app"
import { prisma } from "../../database/prisma"
import { z } from "zod"

describe("User Controller", () => {

    beforeAll(async () => {
        await prisma.user.deleteMany({
            where: { email: "teste@teste.com" }
        })
    })

    const userData = {
        name: "Usuariodeteste",
        email: "teste@teste.com",
        password: "senhadeteste123"
    }

    it("should create a user", async () => {

        const bodySchema = z.object({
            name: z.string().min(3),
            email: z.email(),
            password: z.string().min(6)
        })

        const body = bodySchema.parse(userData)

        const response = await request(app).post("/users/").send(body)

        expect(response.status).toBe(201)

    })

    it("should login user", async () => {

        const user = {
            email: userData.email,
            password: userData.password
        }

        const response = await request(app).post("/users/login").send(user)

        expect(response.status).toBe(200)
    })

})