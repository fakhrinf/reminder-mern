const express = require('express')
const router = express.Router()
const settingModel = require('../model/setting_model')

router.route('/settings/:id?')
    .get(function(req, res) {
        settingModel.find({}).then(setting => {
            res.status(200).json(setting)
        }).catch(err => res.status(400).send(err))
    })
    .post(function(req, res) {
        let setting = new settingModel({
            'sendtime': req.body.sendtime,
            'receiveremail': req.body.receiveremail
        })

        setting.save(err => {
            if(err) res.status(400).send(err)

            res.status(200).json(setting)
        })
    })
    .put(function(req, res) {
        if(req.params.id) {
            settingModel.findOneAndUpdate({'_id': req.params.id}, {
                'sendtime': req.body.sendtime,
                'receiveremail': req.body.receiveremail
            },{ new: true}, (err, data) => {
                if(err) res.status(400).send(err)

                res.status(200).json(data)
            })
        }else{
            res.sendStatus(400)
        }
    })
    .delete(function(req, res) {
        if(req.params.id) {
            settingModel.findOneAndDelete({'_id' : req.params.id}).then(data => {
                res.sendStatus(200)
            }).catch(err => res.status(400).send(err))            
        }else{
            res.sendStatus(400)
        }
    });


module.exports = router