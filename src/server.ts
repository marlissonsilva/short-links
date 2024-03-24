import fastify from "fastify";
import cors from '@fastify/cors'
import routes from "./routes/link.routes";

const app = fastify()

app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
})

routes(app)

app.listen({
    port: 3333,
}).then(() => {
    console.log("HTTP server is running!")
})
