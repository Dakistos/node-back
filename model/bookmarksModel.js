/* src/bookmarksModel.js */

const db = require("../config/db.js");

let model = function (data) {
    if (arguments.length > 0) {
        this.code = data.code;
        this.title = data.title;
        this.url = data.url;
        this.tags = data.tags;
        this.comments = data.comments;
        this.public = data.public;
    }
};

model.findAll = async function (params, result) {
    const sql = `SELECT * FROM bookmarks ORDER BY id_bookmarks DESC`;
    db.all(sql, (err, rows) => {
        if (err) result(null, err);
        else result(null, rows);
    });
};

model.findById = async function (id, result) {
    const sql = `SELECT * FROM bookmarks WHERE id_bookmarks = ?`;
    db.all(sql, id, (err, rows) => {
        if (err) result(null, err);
        else result(null, rows[0]);
    });
};

model.create = async function (datas, result) {
    console.log(datas);
    const sql = `INSERT INTO bookmarks 
        (code, title, url, tags, comments, public) 
        VALUES (?, ?, ?, ?, ?, ?)`;
    // NE PAS utiliser d'arrow fonction,
    // on DOIT conserver le this pour récupérer this.lastID
    db.run(
        sql,
        [
            datas.code,
            datas.title,
            datas.url,
            datas.tags,
            datas.comments,
            datas.public,
        ],
        function (err) {
            if (err) result(null, err);
            else result(null, { id_bookmarks: this.lastID });
        }
    );
};

model.delete = async function (id, result) {
    const sql = `DELETE FROM bookmarks WHERE id_bookmarks = ?`;
    db.run(sql, [id], (err, rows) => {
        if (err) result(null, err);
        else result(null, err);
    });
};

model.insert_replace = async function (id, datas, result) {
    const sql = `INSERT OR REPLACE INTO bookmarks 
        (id_bookmarks, code, title, url, tags, comments, public) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(
        sql,
        [
            id,
            datas.code,
            datas.title,
            datas.url,
            datas.tags,
            datas.comments,
            datas.public,
        ],
        (err, rows) => {
            if (err) result(null, err);
            else result(null, { id_bookmarks: id });
        }
    );
};

model.update = async function (id, datas, result) {
    // COALESCE permet de conserver la valeur existante si elle n'a pas été transmise...
    const sql = `UPDATE bookmarks 
        SET
            code = COALESCE(?, code),
            title = COALESCE(?, title),
            url = COALESCE(?, url),
            tags = COALESCE(?, tags),
            comments = COALESCE(?, comments),
            public = COALESCE(?, public)
    WHERE id_bookmarks = ?`;
    db.run(
        sql,
        [
            datas.code,
            datas.title,
            datas.url,
            datas.tags,
            datas.comments,
            datas.public,
            id,
        ],
        (err, rows) => {
            if (err) result(null, err);
            else result(null, { id_bookmarks: id });
        }
    );
};

module.exports = model;
