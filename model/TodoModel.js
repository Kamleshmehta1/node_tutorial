const mongoose = require('mongoose')

const Schema = mongoose.Schema
const todoSchema = new Schema({
    todo: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('todoList', todoSchema)