const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    }, lastName: {
        type: String,
        required: true,
        trim: true,
    }, username: {
        type: String,
        required: true,
        unique: true
    }, 
    ph: {
        type: String,
        match: /^[0-9]{10}$/,
        trim: true,
        unique: true
    }, email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true
    }, profileImg: {
        type: Buffer
    }
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)