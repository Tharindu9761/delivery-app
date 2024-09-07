const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: data.email,
      subject: data.subject,
      text: data.text,
      html: data.html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject({ success: false, message: "Failed to send email", error });
      } else {
        // console.log(info);
        resolve({ success: true, message: "Email sent successfully", info });
      }
    });
  });
};

module.exports = {
  sendEmail,
};
