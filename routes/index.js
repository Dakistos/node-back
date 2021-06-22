var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send({message: "Hello Rest API"})
});


const db = require('../config/db.js');

router.get('/go/:code', function(req, res, next) {
  const sql = 'SELECT * FROM bookmarks WHERE code = ?'
  db.all(sql, req.params.code, (err, rows) => {
    if (err) {
      res.status(500).send({
        error: 500,
        message: "Internal Server Error",
      });
    } else if (rows.length != 1) {
      res.status(404).send({ error: 404, message: "Not Found" });
    } else {
      res.json(rows);
    }
  });
});


const root_route = "/api/v1/";

const bookmarks = require("./bookmarksRouter.js");
const users = require("./users.js");
const userslogin = require('./userslogin.js')
const checkToken = require('../middleware.js')

router.use(`${root_route}bookmarks`, bookmarks);
router.use(`${root_route}users`, users);
router.use(`${root_route}login`, userslogin);
router.use('/protected', checkToken, (req, res) => {
  res.send("Available only with valid token...")
});


// route générique
router.get("*", function (req, res) {
  res.status(404).send({ message: "Not found" });
});


module.exports = router;
