const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config");


const authMiddleware = (req, res, next) => {
  let token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Token must be required!" });
  }

  try {
    token = req.header("Authorization").split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    if(decoded.role === 101) {
      req.currentUserAdmin = true;
    }
    next();
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = { authMiddleware };