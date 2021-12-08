const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const bcrypt = require('bcryptjs');


const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'basic',
        enum: ['basic', 'admin']
    },
    accessToken: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    favorites : [{
        type: mongoose.Schema.Types.ObjectId, ref:'Songs'
    }],
    listas :[{
        type: mongoose.Schema.Types.ObjectId, ref: 'Lista'
    }]
},{
    timestamps: true
}); 

UserSchema.methods.encryptPassword = async password => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password)
};


module.exports = model('User', UserSchema);