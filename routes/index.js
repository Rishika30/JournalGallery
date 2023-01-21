const express = require('express');
const router = express.Router();
const {ensureAuth, ensureGuest} = require('../middleware/auth');
const Journal = require('../models/Journal');

router.get('/', ensureGuest, (req,res) => {
    res.render('login', {layout: 'login'});
})

router.get('/dashboard', ensureAuth, async(req,res) => {
    try{
        const journals = await Journal.find({user: req.user.id}).lean();
        res.render('dashboard', {
            name: req.user.firstName,
            journals
        });
    }catch(err){
        console.log(err);
        res.render('error/500');
    }
})

module.exports = router