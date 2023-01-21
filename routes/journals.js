const express = require('express');
const router = express.Router();
const {ensureAuth} = require('../middleware/auth');
const Journal = require('../models/Journal');

router.get('/add', ensureAuth, (req,res) => {
    res.render('journals/add');
})

router.post('/', ensureAuth, async(req,res) => {
    try{
        req.body.user = req.user.id;
        await Journal.create(req.body);
        res.redirect('/dashboard');
    }catch(err){
        console.log(err);
        res.render('error/500');
    }
})

router.get('/', ensureAuth, async(req,res) => {
    try{
        const journals = await Journal.find({status:'public'}).populate('user').sort({createdAt: 'desc'}).lean();
        res.render('journals/index', {
            journals,
        })
    }catch(err){
        console.log(err);
        res.render('error/500');
    }
})

router.get('/:id', ensureAuth, async(req,res) => {
    try {
        let journal = await Journal.findById(req.params.id).populate('user').lean();

        if(!journal){
            return res.render('error/404');
        }

        res.render('journals/show', {
            journal,
        });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

router.get('/edit/:id', ensureAuth, async(req,res) => {
    try {
        const journal = await Journal.findOne({_id: req.params.id}).lean();
    if(!journal){
        res.render('error/404');
    }

    if(journal.user != req.user.id){
        res.redirect('/journals');
    }else{
        res.render('journals/edit', {
            journal,
        })
    } 
    } catch (err) {
        console.log(err);
        return res.render('error/500');
    }
     
})

router.put('/:id', ensureAuth, async(req,res) => {
    try {
        let journal= await Journal.findById(req.params.id).lean();
    if(!journal){
        res.render('error/404');
    }

    if(journal.user != req.user.id){
        res.redirect('/journals');
    }else{
        journal = await Journal.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new:true,
            runValidators:true
        })

        res.redirect('/dashboard');
    }  
    } catch (err) {
        console.log(err);
        return res.render('error/500');
    }
    
    
})

router.delete('/:id', ensureAuth, async(req,res) => {
    try{
        await Journal.deleteOne({_id:req.params.id});
        res.redirect('/dashboard');
    }catch(err){
        console.log(err);
        return res.render('error/500');
    }
})

router.get('/user/:userId', ensureAuth, async(req,res) => {
    try {
        const journals = await Journal.find({
            user: req.params.userId,
            status: 'public'
        }).populate('user').lean();

        res.render('journals/index', {
            journals,
        });
    } catch (err) {
        console.log(err);
        res.render('error/500');
    }
})

module.exports = router