 
require("dotenv").config() 
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const { Cashfree, CFEnvironment } = require("cashfree-pg");
 

//settuping cashfree

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX, 
    process.env.CASHFREE_APP_ID, 
    process.env.CASHFREE_SECRET_KEY
)

const createOrder = async(
   { orderId,
    orderAmount,
    orderCurrency = "INR",
    customerId ,
    customerPhone}
    )=>{

   try
    { 
        if (!process.env.CASHFREE_APP_ID || !process.env.CASHFREE_SECRET_KEY) {
        throw new Error("Missing Cashfree credentials");
      }
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
            "return_url": `${baseUrl}/payment/payment-status/${orderId}`,
             payment_methods:"cc,dc,upi"
        },
        order_expiry_time:formattedExpiryDate   // set the valid expiry date
    }

    
   const response = await cashfree.PGCreateOrder(request);  // main thing is this
   
   
   // Response structure: might be response.payment_session_id or response.data.payment_session_id
   const sessionId = response.payment_session_id || (response.data && response.data.payment_session_id);
   if (!sessionId) {
     throw new Error("No payment_session_id in Cashfree response");
   }
   return sessionId;
}
    catch(error){
          console.log("Cashfree Error Status:", err.response?.status);
  console.log("Cashfree Error Data:", err.response?.data);
  console.log("Cashfree Error Headers:", err.response?.headers);
        console.log("Error creating order:", error.message)
        throw error;
    }
};

    const fetchPaymentStatus = async ({orderId}) => {

    try {
       const response = await cashfree.PGOrderFetchPayments(orderId);
        
       let getOrderResponse = response.data || response;
            let orderStatus ;

            if (getOrderResponse.some(transaction => transaction.payment_status === "SUCCESS")) {
                orderStatus = "Success"
        } else if (getOrderResponse.some(transaction => transaction.payment_status === "PENDING")) {
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
 