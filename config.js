/* config.js */

/*
créer un .env définissant la phrase secrète...
*/
const config = {
    secret: process.env.SECRET || "too-many-secrets-1992",
};

module.exports = config;
