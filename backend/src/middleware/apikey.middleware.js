import ApiKey from "../models/apikey.model.js";

export default async function validateApiKey(request, reply) {
  const apiKeyString = request.headers["x-api-key"];

  if (!apiKeyString) {
    return reply.code(400).send({ message: "x-api-key header is required" });
  }

  try {
    const apiKeyDoc = await ApiKey.findOne({ key: apiKeyString }).select(
      "cap key rate",
    );

    if (!apiKeyDoc) {
      return reply.code(401).send({ message: "Invalid API Key" });
    }

    // Attach to request for use in controller
    request.apiKeyDoc = apiKeyDoc;
  } catch (error) {
    request.log.error(error);
    return reply
      .code(500)
      .send({ message: "Server error during API key validation" });
  }
}
