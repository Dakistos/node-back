/* src/users.js */

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

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

model.findAll = async function (params, result) {
  const sql = `SELECT * FROM users ORDER BY id_users DESC`;
  db.all(sql, (err, rows) => {
    if (err) result(null, err);
    else result(null, rows);
  });
};

model.findById = async function (id, result) {
  const sql = `SELECT * FROM users WHERE id_users = ?`;
  db.all(sql, id, (err, rows) => {
    if (err) result(null, err);
    else result(null, rows[0]);
  });
};

model.create = async function (datas, result) {
  console.log(datas);
  const sql = `INSERT INTO users (username, password) VALUES (?, ?)`;

  // Hash Passwords
  const salt = await bcrypt.genSalt(10);
  datas.password = await bcrypt.hash(datas.password, salt);

  db.run(sql, [datas.username, datas.password], function (err) {
    if (err) result(null, err);
    else result(null, { id_users: this.lastID });
  });
};

model.delete = async function (id, result) {
  const sql = `DELETE FROM users WHERE id_users = ?`;
  db.run(sql, [id], (err, rows) => {
    if (err) result(null, err);
    else result(null, err);
  });
};

model.insert_replace = async function (id, datas, result) {
  const sql = `INSERT OR REPLACE INTO users 
        (id_users, username, password) 
        VALUES (?, ?, ?)
    `;
  if (datas.password) {
    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    datas.password = await bcrypt.hash(datas.password, salt);
  }

  db.run(sql, [id, datas.username, datas.password], (err, rows) => {
    if (err) result(null, err);
    else result(null, { id_users: id });
  });
};

model.update = async function (id, datas, result) {
  // COALESCE permet de conserver la valeur existante si elle n'a pas été transmise...
  const sql = `UPDATE users 
        SET
            username = COALESCE(?, username),
            password = COALESCE(?, password)
    WHERE id_users = ?`;

  if (datas.password) {
    // Hash Passwords
    const salt = await bcrypt.genSalt(10);
    datas.password = await bcrypt.hash(datas.password, salt);
  }

  db.run(sql, [datas.username, datas.password, id], (err, rows) => {
    if (err) result(null, err);
    else result(null, { id_users: id });
  });
};

/**
 * CONTROLLER
 */

let controller = function () {};

controller.findAll = function (req, res) {
  model.findAll(req.query, function (err, datas) {
    if (err) res.send(err);
    else res.json(datas);
  });
};

controller.findById = function (req, res) {
  console.log(req.params.id);
  model.findById(req.params.id, function (err, datas) {
    if (err) res.send(err);
    else if (!datas)
      res.status(404).send({ error: 404, message: "Not Found" });
    else res.send(datas);
  });
};

controller.create = function (req, res) {
  const new_datas = new model(req.body);
  model.create(new_datas, function (err, datas) {
    if (err) res.send(err);
    else res.status(201).send(datas);
  });
};

controller.delete = function (req, res) {
  model.delete(req.params.id, function (err, datas) {
    if (err) res.send(err);
    else res.status(204).send(datas);
  });
};

controller.insert_replace = function (req, res) {
  const new_datas = new model(req.body);
  model.insert_replace(req.params.id, new_datas, function (err, datas) {
    if (err) res.send(err);
    else if (!datas)
      res.status(404).send({ error: 404, message: "Not Found" });
    else res.send(datas);
  });
};

controller.update = function (req, res) {
  const new_datas = new model(req.body);
  model.update(req.params.id, new_datas, function (err, datas) {
    if (err) res.send(err);
    else if (!datas)
      res.status(404).send({ error: 404, message: "Not Found" });
    else res.send(datas);
  });
};

/**
 * ROUTER
 */

router.get("/", controller.findAll);
router.get("/:id", controller.findById);

router.post("/", controller.create);

router.delete("/:id", controller.delete);

router.put("/:id", controller.insert_replace);
router.patch("/:id", controller.update);

module.exports = router;
