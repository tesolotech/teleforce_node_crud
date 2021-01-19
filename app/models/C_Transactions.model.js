
const mongoose = require('mongoose');

const C_TransactionsSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    reference_numer: { type: String, required: true },
    amount: { type: String, required: true },
    date: { type: Date },
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

C_TransactionsSchema.method('toClient', function () {
    var obj = this.toObject();

    //Rename fields
    obj.transId = obj._id;
    // delete obj._id;
    return obj;
});

// module.exports = mongoose.model('C_Transaction', C_TransactionsSchema);

const C_Transaction = mongoose.model('C_Transaction', C_TransactionsSchema);

exports.C_Transaction = C_Transaction;


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


exports.getC_TransactionByCId = (id) => {
    return new Promise((resolve, reject) => {
        C_Transaction.find({ "customer_id": mongoose.ObjectId(id) }, (err, resp) => {
            if (err) reject(err);
            resolve(resp);
        })
    })
}


exports.getC_TransactionByDate = (date) => {
    return new Promise((resolve, reject) => {
        C_Transaction.find({ "date": new Date(new Date(date).setHours(00, 00, 00)) }, (err, resp) => {
            if (err) reject(err);
            resolve(resp);
        }).sort({ date: 'asc' })
    })
}


