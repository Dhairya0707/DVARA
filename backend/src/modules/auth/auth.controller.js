import User from '../../models/user.model.js';

export const register = async (request, reply) => {
  const { email, password } = request.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return reply.code(400).send({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });
    
    const token = await reply.jwtSign({ id: user._id });

    return reply.code(201).send({
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};

export const login = async (request, reply) => {
  const { email, password } = request.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return reply.code(401).send({ message: 'Invalid credentials' });
    }

    const token = await reply.jwtSign({ id: user._id });

    return reply.send({
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    request.log.error(error);
    return reply.code(500).send({ message: 'Server error' });
  }
};
