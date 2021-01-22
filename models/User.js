const { Schema, model, Types } = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    links: [{ type: Types.ObjectId, ref: 'Link '}]
});

userSchema.plugin(uniqueValidator);

module.exports = model('User', userSchema);