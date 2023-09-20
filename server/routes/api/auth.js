const express=require('express');
const jwt=require('jsonwebtoken');
const brcypt=require('bcryptjs');
const config=require('config');
const {check, validationResult}=require('express-validator');
const auth=require('../../middleware/auth');
const User = require('../../models/User');

const router=express.Router();

router.get('/',auth,async(req,res)=>{
    try {
        const user=await User.findById(req.user.id).select('-password');
        
        res.status(200).json(user);
        
    } catch (error) {
        res.status(500).send('Server Error...')   
    }
});

router.post('/',[
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists()
],async(req,res)=>{
    
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email,password}=req.body;

    try {
        let user=await User.findOne({email});

        if(!user){
            return res.status(400).json({"message":"Invalid credentials"});
        }
        
        const isMatch=await brcypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({"message":"Invalid credentials"});
        }
        const payload={
            user:{
                id:user.id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtToken'),
            {expiresIn:3600},
            (err,token)=>{
                if (err) throw err;
                res.status(200).send(token);
            })
    } catch (error) {
        res.status(500).send('Server Error...')
    }
});


module.exports=router;