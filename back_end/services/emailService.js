const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "infor.quickdrop@gmail.com",
    pass: "rbjz fwvv iiyx qxer",
  },
});

const sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    const mailOptions = {
      from: "infor.quickdrop@gmail.com",
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
