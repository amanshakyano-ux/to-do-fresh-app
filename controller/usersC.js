const User = require("../models/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();
function generateAccessToken(id,name){
    return jwt.sign({userId:id,name:name}, process.env.JWT_SECRETKEY)
}


function isStringInvalid(str) { 
   return !str || str.trim().length === 0;
}


const addUser = async(req,res)=>{

    try{
        const {name,email,password} = req.body;

        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
          return  res.status(404).json({success:false,message:"All fields are mendatory"})
        }

        let user = await User.findOne({
            where: {email}
        })
        if(user){
          return  res.status(400).json({success:false,message:"User Already Exists With this Email Id>>"})
        }
        let saltRound = 10;

         bcrypt.hash(password, saltRound,  async(err,hash)=>{
          User.create({
               name:name,
               email:email,
               password:hash
           })
         })     
        
       
            res.status(201).json({success:true,
                message:"User signedUp successfully"
            })

    
       }catch(err){
          res.status(500).json({success:false, message:err.message})
    }
}

const loginUser = async (req,res)=>{
    const {email,password} = req.body;

    if(isStringInvalid(email) || isStringInvalid(password)) {
            res.status(404).json({success:false,message:"All fields are mendatory"})
     }

     try{
        const user = await User.findOne({where:{email}})

        if(user)
        {
             
             bcrypt.compare(password, user.password, async(err,result)=>{
                if(err){
                     throw new Error("Something went wrong")
                }
                if(result ===  true){
                    res.status(200).json({success:true,message:"User logged in successfully", token :generateAccessToken(user.id,user.name)})
                }   
                 else
                {
                return res.status(400).json({success:false, message:"Password is incorrect"})
                }
            })
         }else{
           return res.status(404).json({success:false,message:"User does't exists!!"})
         }

     }catch(err){
        res.status(500).json({success:false, message:err.message})
     }

}
 


module.exports = {addUser,loginUser}