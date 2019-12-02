const mongoose = require('mongoose')
const Schema = mongoose.Schema

const reminderSchema = new Schema({
    title: String,
    description: String,
    duedate: String,
    remindin: Number,
    type: String,
    created_at: {type: Date, default: Date.now() },
    updated_at: {type: Date, default: Date.now() }
})

module.exports = Reminder = mongoose.model('reminders', reminderSchema)