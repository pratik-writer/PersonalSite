const nodemailer=require('nodemailer')
require('dotenv').config();

const sendmessage=async (req,res)=>{
    const {name,email,message}=req.body;

    const transporter = nodemailer.createTransport({
        service: "Gmail", // or use a different SMTP service provider
        auth: {
          user: process.env.email, // replace with your email
          pass: process.env.password, // replace with your email password or app-specific password
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.email, // replace with the email where you want to receive the messages
        subject: `Email From Site`,
        text:`From:  `+name+`
        
        `+ message,
      };

      try {
        await transporter.sendMail(mailOptions);
        //res.send("Message sent successfully!");
        res.redirect('/contact?status=success');
      } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending message.");
      }

};


module.exports={sendmessage}