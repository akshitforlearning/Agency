const mongoose = require('mongoose');
const { Schema } = mongoose;


const imageSchema = new Schema({
    url: String,
    filename: String
});

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload' , '/upload/w_200');
});

const agencySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    add1: {
        type: String,
        required: true
    },
    add2: String,
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    phone_number: {
        type: Number,
        required: true,
        min: 10000000,
        max: 99999999
    },
    images: [imageSchema],
    description: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    clients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Client'
        }
    ]
});

const Agency = mongoose.model('Agency', agencySchema);

module.exports = Agency;

