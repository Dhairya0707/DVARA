import crypto from 'crypto';
import ApiKey from '../../models/apikey.model.js';

export const createKey = async (request, reply) => {
  const { name, cap, rate } = request.body;
  const userId = request.user.id;

  try {
    const key = `rk_live_${crypto.randomBytes(16).toString('hex')}`;
    
    const apiKey = await ApiKey.create({
      userId,
      key,
      name: name || 'Default Key',
      cap: cap || 10,
      rate: rate || 2,
    });

    return reply.code(201).send(apiKey);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};

export const getKeys = async (request, reply) => {
  const userId = request.user.id;

  try {
    const keys = await ApiKey.find({ userId });
    return reply.send(keys);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};

export const deleteKey = async (request, reply) => {
  const { id } = request.params;
  const userId = request.user.id;

  try {
    const key = await ApiKey.findOneAndDelete({ _id: id, userId });
    if (!key) {
      return reply.code(404).send({ message: 'Key not found' });
    }
    return reply.send({ message: 'Key deleted successfully' });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};

export const updateKey = async (request, reply) => {
  const { id } = request.params;
  const { name, cap, rate } = request.body;
  const userId = request.user.id;

  try {
    const key = await ApiKey.findOneAndUpdate(
      { _id: id, userId },
      { name, cap, rate },
      { new: true }
    );

    if (!key) {
      return reply.code(404).send({ message: 'Key not found' });
    }

    return reply.send(key);
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};
