const mongoose = require('mongoose')
const Schema = mongoose.Schema

const settingSchema = new Schema({
    sendtime: Number,
    receiveremail: String,
    created_at: {type: Date, default: Date.now() },
    updated_at: {type: Date, default: Date.now() }
})

module.exports = Setting = mongoose.model('settings', settingSchema)