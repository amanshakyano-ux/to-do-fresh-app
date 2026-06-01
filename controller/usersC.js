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


const addUser = async(req,res,next)=>{

    try{
        const {name,email,password} = req.body;
console.log(`Add user called ${name,email,password}`)
        if(isStringInvalid(name) || isStringInvalid(email) || isStringInvalid(password)) {
          return  res.status(404).json({success:false,message:"All fields are mendatory"})
        }

        let user = await User.findOne({email
        })
        if(user){
          return  res.status(400).json({success:false,message:"User Already Exists With this Email Id>>"})
        }
        let saltRound = 10;

       const hashedPassword = await  bcrypt.hash(password, saltRound)
          await User.create({
               name:name,
               email:email,
               password:hashedPassword
           })
          
        
       
            res.status(201).json({success:true,
                message:"User signedUp successfully"
            })

    
         }catch(err){
          return next(err);
      }
}

    const loginUser = async (req,res,next)=>{
    const {email,password} = req.body;

    if(isStringInvalid(email) || isStringInvalid(password)) {
           return res.status(400).json({
    success: false,
    message: "All fields are mandatory"
  });
     }

     try{
        const user = await User.findOne({email})

        if(user)
        {
             
               bcrypt.compare(password, user.password, async(err,result)=>{
               if(err){
                 return next(err);
               }
                if(result ===  true){
                    console.log("HEROOROROROROOR")
                    res.status(200).json({success:true,message:"User logged in successfully", token :generateAccessToken(user._id,user.name)})
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
        return next(err);
      }

}
 


module.exports = {addUser,loginUser}