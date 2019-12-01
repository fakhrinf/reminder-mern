const express = require('express')
const mail = require('nodemailer')
const moment = require('moment')
const router = express.Router()
const reminderModel = require("../model/reminder_model")

router.get('/reminder/testemail', function(req,res) {
    
    const receiver = "sales.admin@argasolusi.com"
    
    reminderModel.find({}, function(err, data) {
        if(err) {
            res.status(422).send(err)
        }else{
            data.forEach((dt, i) => {
                var duedate = moment(dt.duedate, "YYYY-MM-DD").format("MM-DD")
                var ckremind = moment(`${moment().year()}-${duedate}`, "YYYY-MM-DD").subtract(dt.remindbefore,'days').format("YYYY-MM-DD")
                var diff = moment().diff(ckremind, 'days')
                if(diff != 0) {
                    console.log(`SEND REMINDER: ${dt.title}`);
                    let mailer = mail.createTransport({
                        host: "smtp.ethereal.email",
                        port: 587,
                        secure: false,
                        auth: {
                            user: 'anahi.daniel@ethereal.email',
                            pass: 'h5xEQdu1jAfcAbPcv5'
                        }
                    })

                    mailer.sendMail({
                        from: `"Reminder" <no-reply@reminder.com>`,
                        to: receiver,
                        subject: `[REMINDER] ${dt.title}`,
                        text: `Helo, remember ${dt.remindbefore} days from now at ${dt.duedate} is ${dt.description}.`,
                        html: `<h1>Hello,</h1><p> <strong>${dt.remindbefore}</strong> days from now at <strong>${dt.duedate}</strong> is ${dt.description}</p><p>regards, <br/> <strong>Fakhri Nurfauzan</strong><br/> <strong>fakhrinf@hotmail.com</strong></p>`
                    }, (err, data) => {
                        if(err) {
                            res.status(422).send(err)
                        }else{
                            res.status(200).json(data)
                        }
                    })
                }
            })
        }
    })
})

router.get('/reminder/send', function(req, res) {
    
    let mailer = mail.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth: {
            user: 'ssigisystems@gmail.com',
            pass: '!!sigi!!'
        }
    })

    mailer.sendMail({
        from: `"Reminder" <no-reply@reminder.com>`,
        to: "fakhrinf@hotmail.com",
        subject: "[REMINDER]",
        text: "Helo, this is your reminder!",
        html: "<h1>Hello,</h1><p>this is your reminder</p>"
    }, (err, data) => {
        if(err) {
            res.status(422).send(err)
        }else{
            res.status(200).json(data)
        }
    })
})

router.route('/reminder/:id?')
    .get(function(req, res) {

        var id = req.params.id        

        if(id) {
            reminderModel.findOne({"_id": id}).then(reminder => {
                res.status(200).json(reminder)
            })
        }else{
            reminderModel.find({}).then(function(data) {
                res.status(200).json(data)
            }).catch(err => {
                res.status(422).send(err)
                console.log(err);
                
            })
        }
    })
    .post(function(req, res) {
        if(!req.params.id) {
            var reminder = new reminderModel({
                "title": req.body.title,
                "description": req.body.desc,
                "duedate": req.body.duedate,
                "remindin": req.body.remindin,
                "remindbefore": req.body.remindbefore,
                "reminddate": req.body.reminddate
            })
    
            reminder.save(function(err) {
                if(err) {
                    res.status(422).send(err)
                }else{
                    res.status(200).json(reminder)
                }
            });
        }else{
            res.sendStatus(400)
        }

    })
    .put(function(req, res) {

        if(req.params.id) {

            reminderModel.findOneAndUpdate({"_id": req.params.id}, {
                "title": req.body.title,
                "description": req.body.desc,
                "duedate": req.body.duedate,
                "remindin": req.body.remindin,
                "remindbefore": req.body.remindbefore,
                "reminddate": req.body.reminddate,
                "updated_at": Date.now()
            }, { 
                new: true 
            }, function(err, data) {
                if(err) {
                    res.sendStatus(422)
                }else{
                    res.status(200).json(data)
                }
            })

        }else{
            res.sendStatus(400)
        }

    })
    .delete(function(req, res) {
        if(req.params.id) {

            reminderModel.findOneAndDelete({"_id": req.params.id},function(err, data) {
                if(err) {
                    res.sendStatus(422) 
                }else{
                    res.sendStatus(200)
                }
            })
        }else{
            res.sendStatus(400)
        }
    });

module.exports = router