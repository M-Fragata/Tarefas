import request from "supertest"
import { app } from "../../app"
import { prisma } from "../../database/prisma"

describe("Team Controller", () => {

let token: string

    beforeAll(async () => {
        await prisma.team.deleteMany({
            where: { name: "TeamTeste" }
        })

        //Usuário com role de ADMIN
        const login = await request(app).post("/users/login").send({
            email: "admin@gmail.com",
            password: "m4th3us1"
        })

        token = login.body.token
    })

    const teamData = {
        name: "TeamTeste",
        description: "Time para realizar testes com jest"
    }

    it("should create a team", async () => {

        const response = await request(app)
        .post("/teams/")
        .set("Authorization", `Bearer ${token}`)
        .send(teamData)
        
        expect(response.status).toBe(201)

    })

    it("should delete a team", async () => {
        const team = await prisma.team.findFirst({
            where: {name: teamData.name}
        })

        const response = await request(app)
        .delete(`/teams/${team?.id}`)
        .set("Authorization", `Bearer ${token}`)

        expect(response.status).toBe(204)
    })

})