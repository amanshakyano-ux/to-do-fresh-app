const { Sequelize } = require("sequelize");
const {User,Expense} = require("../models")


const isPremium = async(req,res)=>{
    try{

    
    const userId = req.user.id;

     const accType = await  User.findOne( {
        where:{id:userId},
        attributes:["account"]
        })
      res.status(200).json(accType)
    }
    catch(err){
        console.log("ERROR FROM ISPREMIUM FUNCT",err.message)
         return  res.status(500).json({ error: "Something went wrong" });
    }
}

const getAllUsers = async(req,res)=>{
 try{
  const userId= req.user.id
     console.log("gelAllUsers called")
     const users = await User.findAll({
      
      attributes: [
        "id",
        "name",
        "totalExpense"
        // [Sequelize.fn("SUM", Sequelize.col("Expenses.amount")), "totalExpense"]
      ],

      // include: [
      //   {
      //     model: Expense,
      //     attributes: []
      //   }
      // ],
      // group: ["Users.id"],
      order: [[ "totalExpense", "DESC"]]
    });
console.log("QUERY DONE >>>>>")
    res.status(200).json(users);
 }
     catch(err){
      res.status(500).json({message:err.message})
     }
   
}

module.exports= {getAllUsers,isPremium}