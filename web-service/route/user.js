const express = require('express')
const router = express.Router()

router.route('/user/:id?')
    .get(function(req, res) {
        if(!isNaN(req.params.id)) {
            res.status(200).json({
                'id' : req.params.id
            });
        }else{
            res.sendStatus(400);
        }
    })
    .post(function(req, res) {

    })
    .put(function(req, res) {

    })
    .delete(function(req, res) {

    });


module.exports = router