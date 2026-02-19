const {User,Expense} = require("../models")

function isStringInvalid(str) { 
   return !str || str.trim().length === 0;
}
const addExpense = async(req,res)=>{
    const{amount,description,category} = req.body;

    const user_id = req.user.id
    console.log("USER ID IS THIS >>>",user_id)
    if(isStringInvalid(amount) || isStringInvalid(description) || isStringInvalid(category)){
       return res.status(404).json({success:false,message:"fields are mandatory"})
    }
    const expense =  await Expense.create({
        amount:amount,
        description:description,
        category:category,
        UserId:user_id
    })
    res.status(201).json(expense)

}


const getAllExpense = async(req,res)=>{
    const user_id = req.user.id
    console.log(user_id)
    const expenses = await Expense.findAll({where:{
        UserId: req.user.id
    }})

     
    if(expenses.length === 0)
    {
    return  res.status(404).json({success:false, message:"no Expenses  exists"})
    }

    res.status(200).json(expenses)
}

const deleteExp = async(req,res)=>{
    console.log(" BUTTON CLICKED")
    const {id} = req.params;
    const user_id = req.user.id;

    const deleted =   await Expense.destroy({where:{
        id,
        UserId: user_id,
    }})
    if (!deleted) {
         return res.status(404).json({ message: "Item not found" });
       }
    res.status(200).json({success:true, message:"expense is deleted!!"})

}

module.exports = {addExpense,getAllExpense,deleteExp}