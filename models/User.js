const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const baseOptions = {
    discriminatorKey: "typeOfUser",
    collection: 'users'
}

const GeneralUser = new Schema({
    firstname: {type: String, required: true},
    lastname: {type: String, required: true},
    email: {type: String, requried: true},
    isActive: {type: Boolean, default: false},
    password: {type: String, required: true},
    isVerified: {type: Boolean, default: false},
    typeOfUser: {type: String, required: true},
    infoComplete: {type: Boolean, default: false},
    basicProfileInfoComplete: {type: Boolean, default: false},
    images: [{type: Schema.Types.Mixed, required: false, default: null}], 
    maxNumImages: {type: Number, required: false, default: 6},
    hasAtLeastOneImage: {type: Number, required: false, default: false}
}, baseOptions);

module.exports = User = mongoose.model('User', GeneralUser);