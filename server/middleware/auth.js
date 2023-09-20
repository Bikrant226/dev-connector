const jwt=require('jsonwebtoken');
const config=require('config');

module.exports=(req,res,next)=>{
    //get token from header
    const token= req.header('x-auth-token');

    if(!token){
        return res.status(401).json({message: 'Access denied because of invalid token.'});
    }

    try {
        const decode=jwt.verify(token,config.get('jwtToken'));
        req.user=decode.user;
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token.'});   
    }
}