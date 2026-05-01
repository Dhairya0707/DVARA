export default async function authenticate(request, reply) {
  try {
    await request.jwtVerify();
    
    if (!request.user || !request.user.id) {
      return reply.code(401).send({ 
        message: "Invalid session. Please login again.",
        code: "UNAUTHORIZED"
      });
    }
  } catch (err) {
    return reply.code(401).send({ 
      message: "Session expired or invalid. Please login again.",
      code: "UNAUTHORIZED"
    });
  }
}
