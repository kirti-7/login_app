import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';




let transporter = await nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.NODEMAILER_EMAIL, // generated ethereal user
        pass: process.env.NODEMAILER_PASSWORD, // generated ethereal password
    },
});

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
    }
});

// POST: http://localhost:8080/api/registerMail
// @param: {
//     "username": "example123",
//     "userEmail": "example123@example.com",
//     "text": "",
//     "subject": ""
// }
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;
    
    // body of the email
    var email = {
        body: {
            name: username,
            intro: text || "Welcome to the SH10001. We are very excited to have you on board.",
            outro: "Need help, or have query? Just reply to this email we would love to help you.",
        }
    }

    var emailBody = MailGenerator.generate(email);
    let message = {
        // from: process.env.EMAIL,
        from: process.env.NODEMAILER_EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
        // html: "<h1>Kirti</h1>"
    }
    // console.log(message);

    // send mail
    transporter.sendMail(message)
        .then(()=> {return res.status(200).send({msg:"You should receive a mail from us."})})
        .catch(error=> res.status(500).send(error));
    

    // let info = await transporter.sendMail(message);
    // console.log(info.messageId);

    // res.json(info)
}