require("dotenv").config();
const baseUrl = process.env.BASE_URL || "http://localhost:3000";
const User = require("../models/user");
const bcrypt = require("bcrypt");
const ForgotPasswordRequests = require("../models/resetPass");
const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SIB_API_KEY;

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { newpassword } = req.body;

    const request = await ForgotPasswordRequests.findOne({
      _id: id,
      isActive: true,
    });

    if (!request) {
      return res.status(400).send("<h3>Reset link expired or invalid</h3>");
    }

    const user = await User.findById(request.userId);

    if (!user) {
      return res.status(404).send("<h3>User not found</h3>");
    }

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    user.password = hashedPassword;
    await user.save();

    request.isActive = false;
    await request.save();

    return res.status(200).send("<h3>Password updated successfully ✅</h3>");
  } catch (err) {
    return next(err);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequests.findOne({
      _id: id,
      isActive: true,
    });

    if (!request) {
      return res.status(400).send("<h3>Link expired or invalid</h3>");
    }

    return res.status(200).send(`
      <html>
        <body>
          <h3>Reset Your Password</h3>
          <form action="/password/updatepassword/${id}" method="POST">
            <input type="password" name="newpassword" required />
            <button type="submit">Reset Password</button>
          </form>
        </body>
      </html>
    `);
  } catch (err) {
    return next(err);
  }
};

const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = await ForgotPasswordRequests.create({
      isActive: true,
      userId: user._id,
    });

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
      email: "koo860353@gmail.com",
      name: "Kyan",
    };

    const receivers = [
      {
        email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "For password reset of expense tracker app",
      htmlContent: `<h3>Click to reset your password</h3>
       <a href="${baseUrl}/password/resetpassword/${request._id}">Reset Password</a>`,
    });

    return res.status(200).json({
      message: "Password reset link sent to your registered email id!!",
    });
  } catch (err) {
    console.log("Email API Error occurs", err);
    return next(err);
  }
};

module.exports = { forgotpassword, resetPassword, updatePassword };