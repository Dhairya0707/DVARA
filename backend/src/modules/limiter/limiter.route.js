import { checkLimit } from './limiter.controller.js';
import validateApiKey from '../../middleware/apikey.middleware.js';

const limitSchema = {
  headers: {
    type: 'object',
    required: ['x-api-key'],
    properties: {
      'x-api-key': { type: 'string' }
    }
  },
  body: {
    type: 'object',
    properties: {
      identifier: { type: 'string' }
    }
  }
};

export default async function limiterRoutes(fastify, options) {
  fastify.post('/limit', { 
    schema: limitSchema,
    preHandler: validateApiKey 
  }, checkLimit);
}
