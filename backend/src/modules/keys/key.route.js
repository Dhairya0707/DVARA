import { createKey, getKeys, deleteKey, updateKey } from './key.controller.js';
import authenticate from '../../middleware/auth.middleware.js';

export default async function keyRoutes(fastify, options) {
  fastify.addHook('preHandler', authenticate);

  fastify.post('/', createKey);
  fastify.get('/', getKeys);
  fastify.put('/:id', updateKey);
  fastify.delete('/:id', deleteKey);
}
