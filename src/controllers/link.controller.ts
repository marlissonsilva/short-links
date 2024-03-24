import { FastifyRequest, FastifyReply } from 'fastify';
import linkService from '../services/link.services';

const linkController = {
    create: async (request: FastifyRequest, reply: FastifyReply) => {
        await linkService.create(request, reply)
    },

    redirectLink: async (request: FastifyRequest, reply: FastifyReply) => {
        await linkService.redirect(request, reply)
    },

    getLinks: async () => await linkService.getLinks(),

    getMetrics: async () => await linkService.metrics()

}

export default linkController