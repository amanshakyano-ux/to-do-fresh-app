const {User,Expense} = require("../models")

function isStringInvalid(str) { 
   return !str || str.trim().length === 0;
}
const addExpense = async(req,res)=>{
    try{

 
    const{amount,description,category} = req.body;

    const user_id = req.user.id
    console.log("USER ID IS THIS >>>",user_id)
   
    if(isStringInvalid(amount) || isStringInvalid(description) || isStringInvalid(category)){
       return res.status(404).json({success:false,message:"fields are mandatory"})
    }
        const user = await User.findOne({
        where: { id: user_id }
        });
        console.log(user.totalExpense , "TOTAL EXPENSEEESSS")
        
        const newTotalExpense = user.totalExpense + Number(amount); 
      console.log("TTTTTTTTTT", newTotalExpense);
        user.totalExpense =   newTotalExpense  // update value
        await user.save();            // save instance

 
    const expense =  await Expense.create({
        amount:amount,
        description:description,
        category:category,
        UserId:user_id
    })
    res.status(201).json(expense)
}
catch(error){
    res.status(500).json({message :"EXPENSE ADD ERROR >>" + error.message})
}

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
     try{
    const {id} = req.params;
    const user_id = req.user.id;

    const user= await Expense.findOne({where:{id:id, UserId: user_id}})
    const deleteAmt = user.dataValues.amount;
    
     const response = await User.findOne({where:{id:user_id}})
    const totalExpense = response.dataValues.totalExpense
    const newExpense = totalExpense - deleteAmt;
    response.totalExpense =  newExpense;
    await response.save();




    const deleted =   await Expense.destroy({where:{
        id,
        UserId: user_id,
    }})
    if (!deleted) {
         return res.status(404).json({ message: "Item not found" });
       }
    res.status(200).json({success:true, message:"expense is deleted!!"})
    }
    catch(err){
        res.status(500).json({message:`ERROR FROM DELETE SEC ${err.message}`})
    }
}

module.exports = {addExpense,getAllExpense,deleteExp}