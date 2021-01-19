
const mongoose = require('mongoose');
const Customer = require('../models/customers.model.js');


// Create and save Business
exports.createCustomer = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.name) {
        return res.status(400).send({ error: "Name is required!!" });
    }
    if (!req.body.email) {
        return res.status(400).send({ error: "Email is required!!" });
    }

    Customer.findByEmail(req.body.email)
        .then((result) => {
            if (result.email) {
                return res.status(400).send({ error: "Email is already exists!!" });
            } else {
                Customer.createCustomer(req.body)
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
                Customer.createCustomer(req.body)
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


exports.GetAllCustomer = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    Customer.getCustomersList(limit, page)
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



// Delete Customer by id
exports.customerDeleteById = (req, res, next) => {
    Customer.removeById(req.params.userId)
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


//Update Single Customer by id
exports.customerUpdateById = (req, res) => {
    delete req.body.email;
    Customer.updateData(req.body._id, req.body)
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

