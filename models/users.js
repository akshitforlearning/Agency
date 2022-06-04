const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalStorage = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalStorage);

const User = mongoose.model('User' , userSchema);

module.exports = User;