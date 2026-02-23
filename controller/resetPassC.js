require("dotenv").config();

console.log("API KEY:", process.env.SIB_API_KEY);

const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.SIB_API_KEY;

const resetPass = async (req, res) => {
  try {
    console.log("API KEY:", process.env.SIB_API_KEY);
    const { email } = req.body;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "koo860353@gmail.com",
      name: "Kyan",
    };

    const receivers = [
      {
        email: email,
      },
    ];

    await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "For pass reset of expense tracker app",
      htmlContent: `<h3> Click for reset the password</h3>
    <a href="#">Reset Password</a>`,
    });
    res.status(200).json({ message: "Password reset link sent to your regestered email id!!" });
  } catch (err) {
    console.log("Email Api Error occurs", err);
  }
};
module.exports = { resetPass };
