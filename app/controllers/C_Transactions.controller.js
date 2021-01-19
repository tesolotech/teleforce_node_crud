
const mongoose = require('mongoose');
const C_Transaction = require('../models/C_Transactions.model.js');


// Create and save Business
exports.createCTransaction = (req, res, next) => {

    if (!Object.keys(req.body).length) {
        return res.status(400).send({ error: "you can't submit empty!!" });
    }
    if (!req.body.amount) {
        return res.status(400).send({ error: "Amount is required!!" });
    }
    if (!req.body.reference_numer) {
        return res.status(400).send({ error: "Reference_numer is required!!" });
    }

    C_Transaction.findByReferenceNo(req.body.reference_numer)
        .then((result) => {
            if (result.reference_numer) {
                return res.status(400).send({ error: "Reference_numer is already exists!!" });
            } else {
                C_Transaction.createCustomerTransaction(req.body)
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
                C_Transaction.createCustomerTransaction(req.body)
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


exports.GetAllCTransaction = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    C_Transaction.getC_TransactionList(limit, page)
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
exports.CTransactionDeleteById = (req, res, next) => {
    Customer.removeById(req.params.CTransactionId)
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
exports.CTransactionUpdateById = (req, res) => {
    delete req.body.reference_numer;
    delete req.body.customer_id;
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

exports.GetCustomerTransaction = (req, res) => {
    C_Transaction.getC_TransactionByCId(req.params.customerId)
        .then((result) => {
            let response = {
                status: 200,
                message: "SUCEESS",
                data: result || []
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

exports.GetAllTransactionByDate = (req, res) => {
    C_Transaction.getC_TransactionByDate(req.params.date)
        .then((result) => {
            let response = {
                status: 200,
                message: "SUCEESS",
                data: result || []
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
