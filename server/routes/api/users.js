const express=require('express');
const User=require('../../models/User');
const gravatar=require('gravatar');
const brcypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const config=require('config');
const router=express.Router();
const {check, validationResult}=require('express-validator');

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Please enter a valid email').isEmail(),
    check('password','Please enter a password with 6 or more characters').isLength({min:6})    
],async(req,res)=>{
    
    const errors=validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {name,email,password}=req.body;

    try {
        let user=await User.findOne({email});

        if(user){
            res.json({"message":"User with this email already exists"});
            return;
        }
        
        const avatar= gravatar.url(email,{ s:'200',r:'pg',d:'mm'});
        user=User({name,email,avatar,password});

        const salt=await brcypt.genSalt(10);
        user.password=await brcypt.hash(password,salt);
        await user.save();

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