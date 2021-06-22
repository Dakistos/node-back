/* config/db.js */

const db_name = "./data/bookmarks.db";

const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database(db_name, (err) => {
    //
    if (err) return console.error(err.message);
    else {
        console.log(`Connexion réussie à la base de données ${db_name}`);
        db.run(
            `CREATE TABLE bookmarks (
                id_bookmarks INTEGER PRIMARY KEY AUTOINCREMENT,
                code TEXT UNIQUE,
                title TEXT ,
                url TEXT ,
                tags TEXT ,
                comments TEXT ,
                public INTEGER,
                CONSTRAINT code_unique UNIQUE (code)
            )`,
            (err) => {
                // si la première n'existe pas, les autres non plus...
                if (!err) {
                    db.run(
                        `CREATE TABLE users (
                            id_users INTEGER PRIMARY KEY AUTOINCREMENT,
                            username TEXT,
                            password TEXT
                        )`
                    );
                    const sql = `INSERT INTO bookmarks 
                        (code, title, url, tags, comments, public) 
                        VALUES (?,?,?, ?, ?, ?)`;
                    db.run(sql, [
                        "PROF",
                        "Richnou.biz",
                        "https://carlier.biz",
                        "#richnou #pro",
                        null,
                        1,
                    ]);
                    db.run(sql, [
                        "LINKEDIN",
                        "Richnou",
                        "https://linkedin.com/in/rcarlier/",
                        "#richnou #linkedin",
                        "Un super prof...",
                        1,
                    ]);
                    db.run(sql, [
                        "PRIVATE",
                        "Admin",
                        "https://carlier.biz/wp-admin",
                        "#wordpress #admin",
                        "N'est pas public...",
                        0,
                    ]);
                }
            }
        );
    }
});

module.exports = db;
