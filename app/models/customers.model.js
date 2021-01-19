
const mongoose = require('mongoose');

const CustomersSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    email: { type: String, required: true, match: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/ },
    mobile: {
        type: String,
        unique: true,
        match: /^(\+\d{1,3}[- ]?)?\d{10}$/
    },
    address: { type: String }
}, {
    timestamps: true
});

CustomersSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
CustomersSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

// module.exports = mongoose.model('Customers', CustomersSchema);

const Customers = mongoose.model('Customers', CustomersSchema);

exports.Customer = Customers;


CustomersSchema.findById = function (cb) {
    return this.model('Customers').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return CustomersSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCustomer = (customerData) => {
    const customer = new Customers(customerData);
    return customer.save();
};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        Customers.findOne({ "email": email }).exec((err, result) => {
            if (err) return reject(err);
            console.log(result)
            return resolve(result);
        })
    })
};


exports.getCustomersList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Customers.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Customers.remove({ _id: id }, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.updateData = (id, data) => {
    return new Promise((resolve, reject) => {
        Customers.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true }, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    })
}



