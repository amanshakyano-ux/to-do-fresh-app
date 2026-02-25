const { Sequelize, where } = require("sequelize");
const { User, Expense } = require("../models");
const { Op, sum } = require("sequelize");

const isPremium = async (req, res) => {
  try {
    const userId = req.user.id;

    const accType = await User.findOne({
      where: { id: userId },
      attributes: ["account"],
    });
    res.status(200).json(accType);
  } catch (err) {
    console.log("ERROR FROM ISPREMIUM FUNCT", err.message);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log("gelAllUsers called");
    const users = await User.findAll({
      attributes: [
        "id",
        "name",
        "totalExpense",
        // [Sequelize.fn("SUM", Sequelize.col("Expenses.amount")), "totalExpense"]
      ],

      // include: [
      //   {
      //     model: Expense,
      //     attributes: []
      //   }
      // ],
      // group: ["Users.id"],
      order: [["totalExpense", "DESC"]],
    });
    console.log("QUERY DONE >>>>>");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const expenseReport = async (req, res) => {
  
  try {
    const user_id = req.user.id;
    const { period } = req.query;
 
    switch (period ) {

      case"daily":
      //setting today range time
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      

      const dailyExp = await Expense.findAll({
        where: {
          UserId: user_id,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },

        order: [["createdAt", "DESC"]],
      });

      const totalExpense = await Expense.sum("amount", {
        where: {
          UserId: user_id,
          createdAt: {
            [Op.between]: [startOfDay, endOfDay],
          },
        },
      });
    return   res.status(200).json({ dailyExp, totalExp: totalExpense || 0 });
   
    
     
       case "weekly":
        
        console.log("DEBUG")
        
          const now = new Date();

          // get current day number
          const day = now.getDay();

          // convert Sunday (0) to 7
          const adjustedDay = day === 0 ? 7 : day;

          // calculate difference from Monday
          const diff = adjustedDay - 1;

          // create startOfWeek
          const startOfWeek = new Date(now);
          startOfWeek.setDate(now.getDate() - diff);
          startOfWeek.setHours(0, 0, 0, 0);

          // endOfWeek
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
 
          console.log("Server Now:", new Date());
          console.log("StartOfWeek:", startOfWeek);
          console.log("EndOfWeek:", endOfWeek);


      const weeklyExp = await Expense.findAll({
        where:{
          UserId:user_id,
          createdAt:{
           [Op.between]: [startOfWeek,endOfWeek]
          }
        },
        order:[["createdAt","DESC"]]
      })

      const weeklyTotalExp = await Expense.sum("amount",{
        where:{
          UserId:user_id,
          createdAt:{
            [Op.between]:[startOfWeek,endOfWeek]
          }
        }
      })
    return   res.status(200).json({weeklyExp, totalExp:weeklyTotalExp||0});

    case "monthly":
      console.log("CALLED")
       

    const nowMonth = new Date();

    // Start of current month
    const startOfMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0);

    // End of current month
    const endOfMonth = new Date(nowMonth.getFullYear(), nowMonth.getMonth() + 1, 0);
    endOfMonth.setHours(23, 59, 59, 999);

    

    const monthlyExp = await Expense.findAll({
      where:{
        UserId:user_id,
        createdAt:{
          [Op.between]:[startOfMonth,endOfMonth]
        }
      },
      order: [["createdAt", "DESC"]]
    })

     const monthlyTotalExp =await Expense.sum("amount",{
      where:{
        UserId: user_id,
        createdAt:{
          [Op.between] :[startOfMonth,endOfMonth]
        }
      }
     })

     return res.status(200).json({
      monthlyExp,
      totalExp:monthlyTotalExp||0
     })

        

   default:
    return res.status(400).json({
      success: false,
      message: "Invalid period"
    });
    }

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


module.exports = { getAllUsers, isPremium, expenseReport };
