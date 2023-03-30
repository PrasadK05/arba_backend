const jwt = require("jsonwebtoken");
const token_secret = process.env.TOKEN_KEY;

const verifyToken = async function (req, res, next) {
  const token = req.headers.token;

  if (token) {
    return res.status(403).send("Unauthorized");
  }

  try {
    const verification = await jwt.verify(token, token_secret);
    if (verification) {
      next();
    } else {
      return res.status(401).send("Operation not allowed.");
    }
  } catch (e) {
    return res.status(401).send(e.message);
  }
};

module.exports = verifyToken;
