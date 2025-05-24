const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth?.token; // Token passed during handshake

  if (!token) {
    return next(new Error("Authentication error"));
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(new Error("Invalid token"));
    }
    socket.user = decoded; // Attach user info to socket object
    next();
  });
};

module.exports = authenticateSocket;
