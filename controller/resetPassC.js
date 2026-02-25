require("dotenv").config();
const { v4: uuidv4 } = require("uuid")
console.log("API KEY:", process.env.SIB_API_KEY);
const User = require("../models/user")
const bcrypt = require("bcrypt");
const ForgotPasswordRequests = require("../models/resetPass")

const Sib = require("sib-api-v3-sdk");

const client = Sib.ApiClient.instance;

const apiKey = client.authentications["api-key"];

apiKey.apiKey = process.env.SIB_API_KEY;


 const updatePassword = async(req,res)=>{
  try{
    const {id} = req.params;
    const { newpassword } = req.body;
    console.log("updatePassword called")
    console.log(newpassword)
    const request = await ForgotPasswordRequests.findOne({
          where: { id, isActive: true }
        });
     if (!request) {
      return res.status(400).send("<h3>Reset link expired or invalid</h3>");
    }

    const user = await User.findOne({
      where: { id: request.UserId }
    });
     if (!user) {
      return res.status(404).send("<h3>User not found</h3>");
    }


    const hashedPassword = await bcrypt.hash(newpassword, 10);

    // Update password
    await user.update({ password: hashedPassword });

    // Expire link
    await request.update({ isActive: false });

    res.status(200).send("<h3>Password updated successfully ✅</h3>");
  }catch(err)
  {
    res.status(500).json({success:false,message:err.message})
  }
 }

const resetPassword = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequests.findOne({
      where: { id, isActive: true }
    });

    if (!request) {
      return res.status(400).send("<h3>Link expired or invalid</h3>");
    }

    // Link valid hai → form show karo
    res.status(200).send(`
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
    res.status(500).send("<h3>Something went wrong</h3>");
  }
};



const forgotpassword = async (req, res) => {
  try {
    console.log("EMAIL TOOK")
    //import the uuid from forgetpass table;
       const { email } = req.body;
        const user = await User.findOne({ where: { email } });
          if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
     const id = uuidv4();
      await ForgotPasswordRequests.create({
      id: id,
      isActive: true,
      UserId: user.id
    });
    console.log("API KEY:", process.env.SIB_API_KEY);
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
      <a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
    });
    res.status(200).json({ message: "Password reset link sent to your regestered email id!!" });
  } catch (err) {
    console.log("Email Api Error occurs", err);
  }
};
module.exports = { forgotpassword,resetPassword, updatePassword};
