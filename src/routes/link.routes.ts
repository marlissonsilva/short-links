import { FastifyInstance, RouteShorthandOptions } from 'fastify';
import linkController from '../controllers/link.controller';

const options: RouteShorthandOptions = {
    schema: {
        params: {
            code: { type: 'string', minLength: 3 }
        }
    }
};

const routes = async (app: FastifyInstance) => {
    app.get('/:code', options, linkController.redirectLink);
    app.post('/api/links', linkController.create);
    app.get('/api/links', linkController.getLinks);
    app.get('/api/metrics', options, linkController.getMetrics);
};

export default routes;