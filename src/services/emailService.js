require("dotenv").config();
// const nodemailer = require('nodemailer')
import nodemailer from "nodemailer";

let senSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        type: "SMTP",
        host: "smtp.gmail.com",
        secure: true,
        port: 465,
        auth: {
            user: process.env.EMAI_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Duc Anh 👻" <haducanh660@gmail.com>', // sender address
        to: "anhhdtech@gmail.com", // list of receivers
        subject: "Confirmation of your appointment", // Subject line
        html: `<b>HI ${dataSend.patientName}</b>
        <p>Thanks for getting in touch with us</p>
        <p>This is a confirmation email regarding your appointment at 
        [Hospital Name and address] with Dr ${dataSend.doctorName} at ${dataSend.time} on 
        [Day and Date]</p>
        <p>If the infomation above is correct.Please click here to confirm your infomation: </p>
        <a href=${dataSend.redirectLink} target='_blank'>Click here</a>
        <p><b>Regards,</b></p>
        <p>Booking care VN.</p>
        `, // html body
    });
};

module.exports = {
    senSimpleEmail,
};
