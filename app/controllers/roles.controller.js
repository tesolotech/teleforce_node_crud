
// const mongoose = require('mongoose');
// const User = require('../models/user.model.js');
const Role = require('../models/roles.model.js');


// Create and save user
exports.createRoles = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.name) {
        return res.status(400).send({ error: "Name is required!!" });
    }
    if (!req.body.permission) {
        return res.status(400).send({ error: "Permission is required!!" });
    }

    Role.findByName(req.body.name)
        .then((result) => {
            if (result.name) {
                return res.status(400).send({ error: "Name is already exists!!" });
            } else {
                Role.createRoles(req.body)
                    .then(async (result) => {
                        result = result.toObject();
                        // result.id = result._id;
                        delete result.__v;
                        let response = {
                            status: 201,
                            message: "SUCEESS",
                            data: result
                        }
                        res.status(201).send(response);
                    }).catch((err) => {
                        let response = {
                            status: 400,
                            message: "ERROR",
                            error: err
                        }
                        return res.status(400).send(response);
                    })
            }
        }).catch((err) => {

            if (Object.entries(err).length === 0) {
                Role.createRoles(req.body)
                    .then(async (result) => {
                        result = result.toObject();
                        // result.id = result._id;
                        delete result.__v;
                        let response = {
                            status: 201,
                            message: "SUCEESS",
                            data: result
                        }
                        res.status(201).send(response);
                    }).catch((err) => {
                        let response = {
                            status: 400,
                            message: "ERROR",
                            error: err
                        }
                        return res.status(400).send(response);
                    })

            } else {
                console.log(err);
                let response = {
                    status: 400,
                    message: "ERROR",
                    error: err
                }
                return res.status(400).send(response);
            }

        });

};

exports.GetAllRoles = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    Role.getRolesList(limit, page)
        .then((result) => {
            let response = {
                status: 200,
                message: "SUCEESS",
                data: result
            }
            res.status(200).json(response);
        }).catch((err) => {
            let response = {
                status: 400,
                message: "ERROR",
                data: []
            }
            res.status(400).json(response);
        })
}


// Delete Roles
exports.deleteRoleById = (req, res, next) => {
    Role.removeById(req.params.roleId)
        .then((result) => {
            let response = {
                status: 201,
                message: "SUCCESS",
                data: result
            }
            res.status(201).json(response);
        }).catch((err) => {
            let response = {
                status: 400,
                message: "ERROR",
                data: {}
            }
            res.status(400).json(response);
        })
};


//Update Single Role by id
exports.UpdateRolesById = (req, res) => {
    Role.updateData(req.body._id, req.body)
        .then((result) => {
            console.log("result is", result);
            let response = {
                status: 200,
                message: "SUCCESS",
                data: result
            }
            res.status(200).json(response);
        }).catch((err) => {
            console.log("err is", err);

            let response = {
                status: 400,
                message: "ERROR",
                error: err
            }
            res.status(400).json(response);
        })

};

