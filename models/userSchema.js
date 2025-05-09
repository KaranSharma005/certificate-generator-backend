const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type : String,
        required: true,
        unique: true,
    },
    certificates: {
        type: Array,
        default : [],
    }
})

const user = mongoose.model('User', userSchema);
module.exports = {
    user
}