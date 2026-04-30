const Payment = require("../models/payment")
require("dotenv").config() 
const { Cashfree, CFEnvironment } = require("cashfree-pg");


//settuping cashfree

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX, 
    process.env.CASHFREE_APP_ID, 
    process.env.CASHFREE_SECRET_KEY
)

const createOrder = async(
    orderId,
    orderAmount,
    orderCurrency = "INR",
    customerId ,
    customerPhone
    )=>{

   try
    { 
     const expiryDate = new Date(Date.now() + 60 * 60 * 1000);  //1hr from now
     const formattedExpiryDate = expiryDate.toISOString();

     const request = 
     {
        "order_amount": orderAmount,
        "order_currency": orderCurrency,
        "order_id": orderId,

        "customer_details": {
            "customer_id": customerId,
            "customer_phone": customerPhone
        },

        "order_meta": {
            "return_url": `http://localhost:3000/payment/payment-status/${orderId}`,
             payment_methods:"cc,dc,upi"
        },
        order_expiry_time:formattedExpiryDate   // set the valid expiry date
    }

    
   const response = await cashfree.PGCreateOrder(request);  // main thing is this
   
   
   return response.data.payment_session_id;
}
    catch(error){
        console.log("Error creating order:", error.message)

    }
};


    const fetchPaymentStatus = async (orderId) => {

    try {
            console.log(orderId, "ORDER ID IS THIS")

            const response = await cashfree.PGOrderFetchPayments(orderId);
          
            

             

            let getOrderResponse = response.data
            let orderStatus ;

            if (getOrderResponse.filter(transaction => transaction.payment_status === "SUCCESS").length > 0) {
                orderStatus = "Success"
        } else if (getOrderResponse.filter(transaction => transaction.payment_status === "PENDING").length > 0) {
                orderStatus = "Pending"
        } else {
                orderStatus = "Failure"
        }

            console.log("YOUR STATUS IS ",orderStatus)
            return orderStatus;

    } catch (err) {
            console.log("Fetch status error:", err);
            return "ERROR";
    }
    };



// exports.getPaymentStatus = async(req,res)=>{
//     try{
//         const response = 
//     }
// }
 module.exports = {createOrder,fetchPaymentStatus}
 