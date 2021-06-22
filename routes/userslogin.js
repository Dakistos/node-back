/* src/userslogin.js */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config");

/**
 * MODEL
 */
const db = require("../config/db.js");

let model = function (data) {
    if (arguments.length > 0) {
        this.username = data.username;
        this.password = data.password;
    }
};

model.login = async function (body, result) {
    console.clear();
    if (!body.username || !body.password) {
        console.log(body);
        result(401, null);
    } else {
        let username = body.username;
        let password = body.password;
        console.log(body);
        const sql = `SELECT * FROM users WHERE username = ? LIMIT 1`;
        db.all(sql, [username], async (err, rows) => {
            if (err) result(null, err);
            else {
                if (rows.length == 0) {
                    result(null, err);
                } else {
                    const user = rows[0];

                    let ok = await bcrypt.compare(password, user.password);
                    if (!ok) {
                        result(null, err);
                    } else {
                        const token = jwt.sign(
                            {
                                id: user.id_users,
                                username: user.username,
                            },
                            config.secret,
                            { expiresIn: "3 hours" }
                        );
                        let response = {
                            token,
                            ...user,
                        };
                        result(null, response);
                    }
                }
            }
        });
    }
};

/**
 * CONTROLLER
 */

let controller = function () {};

controller.login = function (req, res) {
    model.login(req.body, function (err, datas) {
        if (err) {
            console.log(err);
            res.status(401).send({ error: 401, message: "Unauthorized" });
        } else if (!datas)
            res.status(403).send({ error: 403, message: "Forbidden" });
        else res.send(datas);
    });
};

/**
 * ROUTER
 */

// post obligatoire car nécessaire pour axios
router.post("/", controller.login);

module.exports = router;
