const { createOrder, fetchPaymentStatus } = require("../services/cashfreeService");
const Payment = require("../models/payment");
const User = require("../models/user");

const processPayment = async (req, res, next) => {
  try {
    
    const userId = req.user._id;

    const orderId = "ORDER-" + Date.now();
    const orderAmount = 2000;
    const orderCurrency = "INR";
    const customerId = userId.toString();
    const customerPhone = "9999999999";

    const paymentSessionId = await createOrder({
      orderId,
      orderAmount,
      orderCurrency,
      customerId,
      customerPhone,
    });

    await Payment.create({
      orderId,
      paymentSessionId,
      orderAmount,
      orderCurrency,
      paymentStatus: "Pending",
      userId,
    });

    return res.status(201).json({ paymentSessionId, orderId });
  } catch (err) {
    console.log("ERROR IN CREATING ORDER", err.message);
    return next(err);
  }
};

const getPaymentStatus = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await Payment.findOne({ orderId });

    if (!order) {
      return res.status(404).send("Payment record not found");
    }

    const status = await fetchPaymentStatus({ orderId });

    order.paymentStatus = status;
    await order.save();

    const user = await User.findById(order.userId);

    if (!user) {
      return res.status(404).send("User not found");
    }

    if (status === "Success") {
      user.isPremium = true;
      await user.save();

      return res.redirect("/success");
    }

    if (status === "Pending") {
      return res.send("Complete your payment!!");
    }

    return res.send("Failed");
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  getPaymentStatus,
  processPayment,
};