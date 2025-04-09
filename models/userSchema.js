const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true
    },
    certificates: {
        type: Array,
        default : [],
    }
})

const User = mongoose.model('User', userSchema);