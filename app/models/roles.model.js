
const mongoose = require('mongoose');

const RoleSchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    permission: { type: String, required: true },
    context: { type: String },
}, {
    timestamps: true
});

RoleSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
RoleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret, options) => {
        delete ret.__v;
        ret.id = ret._id.toString();
        delete ret._id;
    },
});

const Role = mongoose.model('Role', RoleSchema);

exports.Role = Role;


RoleSchema.findById = function (cb) {
    return this.model('Role').find({ id: this.id }, cb);
};


exports.findById = (id) => {
    return RoleSchema.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createRoles = (rolesData) => {
    const roles = new Role(rolesData);
    return roles.save();
};

exports.findByName = (name) => {
    return new Promise((resolve, reject) => {
        Role.findOne({ "name": name }).exec((err, result) => {
            if (err) return reject(err);
            return resolve(result);
        })
    })
};


exports.getRolesList = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Role.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, prod) {
                if (err) {
                    reject(err);
                } else {
                    resolve(prod);
                }
            })
    });
};


exports.removeById = (id) => {
    return new Promise((resolve, reject) => {
        Role.remove({ _id: id }, (err) => {
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
        Role.findByIdAndUpdate(id, { $set: data }, { new: true, upsert: true }, (err, result) => {
            if (err) reject(err);

            resolve(result);
        });
    })
}

