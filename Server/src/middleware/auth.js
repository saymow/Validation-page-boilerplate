const jwt = require("jsonwebtoken");

const authConfig = require("../config/auth.json");

exports.Middleware = function (req, res, next) {
  const { authorization } = req.headers;

  if (!authorization)
    return res.status(401).json({ error: { message: "Token not provided" } });

  let parts = authorization.split(" ");

  if (parts.length !== 2)
    return res.status(401).json({ error: { message: "Token error" } });

  let [schema, token] = parts;

  if (!/^Bearer$/.test(schema))
    return res.status(401).json({ error: { message: "Token malformated." } });

  jwt.verify(token, authConfig.secret, (err, decodedId) => {
    if (err)
      return res.status(401).json({ error: { message: "Invalid token" } });

    req.user_id = decodedId.id;

    return next();
  });
};
