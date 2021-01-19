const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    username: { type: String },
    email: { type: String, required: true },
    mobile: {
        type: String,
        required: true,
        unique: true,
        match: /^(\+\d{1,3}[- ]?)?\d{10}$/
    },
    password: { type: String, required: true },
    userRole: { type: String }
}, {
    timestamps: true
});

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
UserSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

// module.exports = mongoose.model('User', UserSchema);

const User = mongoose.model('User', UserSchema);

exports.User = User;


UserSchema.findById = function (cb) {
    return this.model('User').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return UserSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

exports.findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        User.findOne({ "email": email }).exec((err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
};


exports.getUserrList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
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
        User.remove({ _id: id }, (err) => {
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
        User.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true }, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    })
}


