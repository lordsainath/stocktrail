import { AuthenticationError } from "../utils/appError.js";
import { verifyToken } from "../utils/token.js";

export const protect = (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		throw new AuthenticationError("Authorization token is required");
	}

	const token = authHeader.split(" ")[1];

	let decoded;
	try {
		decoded = verifyToken(token);
	} catch (error) {
		throw new AuthenticationError(error.message || "Invalid token");
	}

	req.user = { id: decoded.id };
	next();
};
