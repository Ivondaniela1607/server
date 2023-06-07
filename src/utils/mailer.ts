import path from 'path';
const nodemailer = require("nodemailer");

// development@emprendim.com
// jfsdf7GGf43*
// imap.hostinger.com (993)-SSL/TLS
// smtp.hostinger.com (465)-SSL/TLS

export const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// transporter.verify().then(() => {
//     console.log("Email preparado");
//   },
//   (err) => {
//     console.log("Error in verify");

//     console.log(err);
//   }
// );

export const send = (to, name, subject, html, filePpath=null) => {
  return new Promise((resolve, reject) => {
    try {      
      transporter.verify().then(
        () => {
           console.log("Email preparado");
        },
        (err) => {
          console.log("Error in verify");
          console.log(err);
        }
      );
      let mailOptions = {
        from: name+ `<${process.env.MAIL_FROM}>`, 
        to: to,
        subject: subject,
        html: html,
      };
      if (filePpath){
        mailOptions["attachments"] = [
          {   
            filename: path.basename(filePpath),
            path: path.join(__dirname, filePpath)  
        }
        ]
      } 
      
      transporter.sendMail(mailOptions, function (error, info) {
        console.log(error);
        if (error) {
          return resolve(false);
        }
        // console.log(info);

        return resolve(info);
      });
    } catch (error) {
      console.error("There is an error in send email: ", error);
      resolve(false);
    }
  });
};
