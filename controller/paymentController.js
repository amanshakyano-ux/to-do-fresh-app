
const {createOrder,fetchPaymentStatus}= require("../services/cashFreeService")
const Payment = require("../models/payment")
const User = require("../models/user")

const processPayment= async(req,res)=>{

 
const UserId= req.user.id;

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const  customerId = "1";
    const customerPhone = "9999999999";

    try{

        const paymentSessionId = await createOrder( 
           orderId,
           orderAmount,
           orderCurrency,
           customerId,
           customerPhone
          )
          console.log("FROM CREATE ORDER:", paymentSessionId); /// debugging
          await Payment.create({
              orderId,
              paymentSessionId,
              orderAmount,
              orderCurrency,
              paymentStatus: "Pending",
              UserId
          });
           
         res.status(201).json({paymentSessionId})
    }catch(err){
        console.log("ERROR IN CREATING ORDER")
        console.log(err.message)
    }
}

const getPaymentStatus = async(req,res)=>{
     
    console.log("ZZZZZZZZZZZZZZZZ")
    const { orderId } = req.params;
    
    
   
   
   
   
   const order = await Payment.findOne({
       where: { orderId }
    });
    if (!order) {
return res.status(404).send("Payment record not found");
}
    const status = await fetchPaymentStatus(orderId);
    order.paymentStatus = status;
    await order.save();
    const userId = order.UserId;
    const user = await User.findByPk(userId)

    
    if (!user) {
        return res.status(404).send("User not found");
    }

      
        

  if (status === "Success") {
     
    user.isPremium = true;
    await user.save();
    //  return res.redirect("/success");  
    res.status(200).json({
        message:"congrats",
        success:true
    }) 
 

  } else if(status === "Pending"){
    res.send("Complete your payment!!");
  }else{
    res.send("Failed")
  }

     
}

module.exports = {
    getPaymentStatus,processPayment
}