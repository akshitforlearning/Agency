const mongoose = require('mongoose');
const { Schema } = mongoose;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone_number: {
        type: Number,
        required: true,
        min: 1000000000,
        max: 9999999999
    },
    total_bill: {
        type: Number,
        required: true
    },
    clientImages: {
        url: String,
        filename: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    agency: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Agency'
        }
    ]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;