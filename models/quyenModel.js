// review / rating / createdAt / ref to tour / ref to user
const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        ten: {
            type: String,
            required: [true, 'Name of role can not be null!']
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Quyen = mongoose.model('Quyen', roleSchema);

module.exports = Quyen;
