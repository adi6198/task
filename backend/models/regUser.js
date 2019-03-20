const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const RegUserSchema = new Schema({
    name: {
        type: String
    },
    email: {
        type: String 
    },
    password: {
        type: String
    }
});

RegUserSchema.methods.generateHash = function( password ) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

RegUserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

const RegUser = mongoose.model('reguser', RegUserSchema);
module.exports = RegUser;