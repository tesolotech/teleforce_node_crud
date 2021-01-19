
const mongoose = require('mongoose');
const User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');


// Create and save user
exports.signupUser = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.password) {
        return res.status(400).send({ error: "Password is required!!" });
    }
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!!" });
    }

    User.findByEmail(req.body.email)
        .then((result) => {
            if (result.email) {
                return res.status(400).send({ error: "Email is already exists!!" });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        req.body.password = hash;
                        User.createUser(req.body)
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
                })

            }
        }).catch((err) => {

            if (Object.entries(err).length === 0) {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        req.body.password = hash;
                        User.createUser(req.body)
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

exports.getUserListPaging = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    User.getUserrList(limit, page)
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

// Login user
exports.loginUser = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.password) {
        return res.status(400).send({ error: "Password is required!!" });
    }
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!!" });
    }
    // console.log(req.body);
    User.findByEmail(req.body.email)
        .then((user) => {
            console.log(user);
            if (user.length < 1) {
                res.status(401).json({
                    message: 'Auth Failed'
                });
            }
            bcrypt.compare(req.body.password, user.password, (err, result) => {
                if (err) {
                    res.status(401).json({
                        message: 'Auth Failed'
                    });
                }
                if (result) {
                    res.status(200).json({
                        status: 200,
                        message: 'Auth Successful',
                        token: 'jwttoken'
                    });
                }
            })
        })
        .catch((err) => {
            console.log("err", err);
            let response = {
                status: 400,
                message: "ERROR",
                data: []
            }
            res.status(400).json(response);
        })

};

// Delete User by id
exports.userDeleteById = (req, res, next) => {
    User.removeById(req.params.userId)
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


//Update Single User by id
exports.userUpdateById = (req, res) => {
    delete req.body.password;
    delete req.body.email;
    User.updateData(req.body._id, req.body)
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

