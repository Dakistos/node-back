/* src/bookmarksController.js */

const model = require("../model/bookmarksModel.js");

const validUrl = require("valid-url");
const { nanoid } = require("nanoid");

let controller = function () {};

controller.findAll = function (req, res) {
    model.findAll(req.query, function (err, datas) {
        if (err) res.send(err);
        else res.send(datas);
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

    console.log(new_datas);

    if (validUrl.isUri(new_datas.url)) {
        if (!new_datas.code) {
            new_datas.code = nanoid(8);
        }

        model.create(new_datas, function (err, datas) {
            if (err) res.send(err);
            else res.status(201).send(datas);
        });
    } else {
        res.status(400).send({ error: 400, message: "Bad Request" });
    }
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

module.exports = controller;
