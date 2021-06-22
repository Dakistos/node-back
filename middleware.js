/* middleware.js */

const jwt = require("jsonwebtoken");
const config = require("./config");

// Récupération du Token dans les paramètres...
const extractBearerToken = (headerValue) => {
    if (typeof headerValue !== "string") return false;
    const matches = headerValue.match(/(bearer)\s+(\S+)/i);
    return matches && matches[2];
};

// Vérification de la validité du Token
const checkTokenMiddleware = (req, res, next) => {
    const token =
        req.headers.authorization &&
        extractBearerToken(req.headers.authorization);

    if (!token) {
        return res.status(401).send({ error: 401, message: "Unauthorized" });
    }

    // Véracité du token
    jwt.verify(token, config.secret, (err, decodedToken) => {
        if (err) {
            res.status(403).send({ error: 403, message: "Forbidden" });
        } else {
            return next();
        }
    });
};

module.exports = checkTokenMiddleware;
