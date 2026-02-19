
 require("dotenv").config()
 const jwt = require("jsonwebtoken")
 const User = require("../models/user")

const authenticate = async(req,res,next)=>{
    try{
         console.log("called security")
        
        const token = req.headers['authorization']
        
        const user = jwt.verify(token,process.env.JWT_SECRETKEY)
        console.log(`USER ID>> ${user.userId}`)
        User.findByPk(user.userId)
            .then(user=>{
                // console.log("USER DATA++++",user.id)
                req.user =  user;
                 
                next();
            })
        
    }catch(err){
        console.log("THIS IS THE MIDDLEWARE ERROR")
        return res.status(401).json({success:false,message:err.message})
    }

}
module.exports = {authenticate}