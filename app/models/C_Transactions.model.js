
const mongoose = require('mongoose');

const C_TransactionsSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    reference_numer: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date, default: Date.now },
    customer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Customers' }
}, {
    timestamps: true
});

C_TransactionsSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
C_TransactionsSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

// module.exports = mongoose.model('C_Transaction', C_TransactionsSchema);

const C_Transaction = mongoose.model('C_Transaction', C_TransactionsSchema);

exports.C_Transaction = C_Transactions;


C_TransactionsSchema.findById = function (cb) {
    return this.model('C_Transaction').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return C_TransactionsSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createCustomerTransaction = (customerTData) => {
    const CT = new C_Transaction(customerTData);
    return CT.save();
};

exports.findByReferenceNo = (reference_numer) => {
    return new Promise((resolve, reject) => {
        C_Transaction.findOne({ "reference_numer": reference_numer }).exec((err, result) => {
            if (err) return reject(err);
            console.log(result)
            return resolve(result);
        })
    })
};


exports.getC_TransactionList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        C_Transaction.find()
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
        C_Transaction.remove({ _id: id }, (err) => {
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
        C_Transaction.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true }, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    })
}



