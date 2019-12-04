const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
const logger = require('morgan')
const reminder = require('./route/reminder')
const setting = require('./route/settings')
const mongoose = require('mongoose')
const cronjob = require('node-cron')
const sendremainder = require('./services/sendreminder')

const app = express()

app.use(bodyparser.urlencoded({ extended: false }))
 
app.use(bodyparser.json())
app.use(cors())
app.use(logger('dev'))

mongoose.connect("mongodb://reminder:!!reminder!!@localhost:27017/reminderdb", {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
    console.log("Mongodb Connected");
}).catch(err => console.log(err))

app.use('/api/', reminder)
app.use('/api/', setting)

sendremainder.start()

app.use(express.static('../reminder-arga/build'))
app.listen(3000)