import jwt from "jsonwebtoken";
import userModel from "../model/userModel.mjs";

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .send({ status: false, message: "Access token is required" });
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if the token has expired
    if (decoded.exp < Date.now() / 1000) {
      return res
        .status(401)
        .send({ status: false, message: "Token has expired" });
    }

    // Asynchronously check if the user exists in the database
    const user = await userModel.findOne({ email: decoded.username });

    if (!user) {
      return res.status(403).send({ status: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    // Check if the error is due to token expiration
    if (err.name === "TokenExpiredError") {
      return res
        .status(401)
        .send({ status: false, message: "token has expired" });
    }

    // Catch all other JWT errors (invalid token)
    return res
      .status(403)
      .send({ status: false, message: "Invalid or malformed token" });
  }
};

export { authenticate };
