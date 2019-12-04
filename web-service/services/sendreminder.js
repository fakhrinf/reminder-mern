const cronjob = require('node-cron')
const reminderModel = require('../model/reminder_model')
const mail = require('nodemailer')
const settingModel = require('../model/setting_model')
const moment = require('moment')

const mailService = {
    host: "smtp.ethereal.email",
    port: 587,
    user: 'anahi.daniel@ethereal.email',
    pass: 'h5xEQdu1jAfcAbPcv5',

    sendtest: function(rm, st) {

        const mailer = mail.createTransport({
            host: this.host,
            port: this.port,
            secure: false,
            auth: {
                user: this.user,
                pass: this.pass
            }
        })

        mailer.sendMail({
            from: `"Reminder" <no-reply@reminder.com>`,
            to: `${st.receiveremail}`,
            subject: `[REMINDER] ${rm.title}`,
            text: `Helo, remember ${rm.remindin} days from now at ${rm.duedate} is ${rm.description}.`,
            html: `<h1>Helo</h1>, <p>remember <strong>${rm.remindin} days</strong> from now at <strong>${rm.duedate}</strong> is ${rm.description}.</p>`
        }, (err, data) => {
            if(err) {
                console.log(`SEND ERROR: ${err}`);
            }else{
                console.log(`Email send to: ${st.receiveremail}`);
                
            }
        })
    },

    sendemail: function(rm, st) {
        const mailer = mail.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            auth: {
                user: 'ssigisystems@gmail.com',
                pass: '!!sigi!!'
            }
        })

        mailer.sendMail({
            from: `"Reminder" <no-reply@reminder.com>`,
            to: st.receiveremail,
            subject: `[REMINDER] ${rm.title}`,
            text: `Helo, remember ${rm.remindin} days from now at ${rm.duedate} is ${rm.description}.`,
            html: `<h1>Hello,</h1><p> <strong>${rm.remindin}</strong> days from now at <strong>${rm.duedate}</strong> is ${rm.description}</p><p>regards, <br/> <strong>Fakhri Nurfauzan</strong><br/> <strong>fakhrinf@hotmail.com</strong></p>`
        }, (err, data) => {
            if(err) {
                console.log(`SEND ERROR: ${err}`);
            }else{
                console.log(`Email send to: ${st.receiveremail}`);
            }
        })
    },

    start: async function() {
        console.log("Start cronjob..");        

        const getSetting = await settingModel.find({})
        // console.log(getSetting);
        
        if(getSetting.length > 0) {

            const cron = cronjob.schedule(`0 ${getSetting[0].sendtime} * * *`, () => {
                reminderModel.find({}).then(remainderdata => {
                    remainderdata.forEach(rm => {
                        var duedate = moment(rm.duedate, "YYYY-MM-DD").format("MM-DD")
                        
                        var ckremind = moment(`${moment().year()}-${duedate}`, "YYYY-MM-DD").subtract(rm.remindin,'days').format("YYYY-MM-DD")
                        // console.log(`${duedate} remind me at ${ckremind}`);
                        
                        var diff = moment().diff(ckremind, 'days')
                        // console.log(`Still ${diff} days left.`);
                        
                        if(diff == 0) {
                            this.sendemail(rm, getSetting[0])
                        }else{
                            console.log("NO REMINDER ALERT FOR TODAY");
                        }
                    });
                }).catch(err => console.log(err))
            })

            cron.start()
        }else{
            console.log("CANNOT FIND CONFIGURATION.");
        }
        
    },
    
}

module.exports = mailService