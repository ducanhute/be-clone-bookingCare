require("dotenv").config();
import { LANGUAGE } from "../utils/constant";
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
        from: '"Bookingcare VN" <haducanh660@gmail.com>', // sender address
        to: "anhhdtech@gmail.com", // list of receivers
        subject: "Confirmation of your appointment", // Subject line
        html: getBodyHtmlEmail(dataSend),
    });
};
let getBodyHtmlEmail = (dataSend) => {
    let result = "";
    if (dataSend.language === LANGUAGE.VI) {
        result = `<b>Xin chào ${dataSend.patientName}</b>
        <p>Cảm ơn bạn vì đã liên hệ với chúng tôi</p>
        <p>Đây là email xác nhận lịch hẹn khám bệnh của bạn. Dưới đây là thông tin đặt lịch của bạn:</p>
        <ul><li>
            <b>Thời gian:</b> ${dataSend.time}
        </li>
        <li>
            <b>Bác sĩ:</b> ${dataSend.doctorName}
        </li>
        <li>
            <b>Địa chỉ:</b> ${dataSend.address}
        </li>
        </ul>
        <p>Nếu thông tin trên là chính xác, vui lòng bấm vào đường link dưới đây để xác nhận</p>
        <a href=${dataSend.redirectLink} target='_blank'>Bấm vào đây</a>
        <p><b>Trân trọng,</b></p>
        <p>Booking care VN.</p>
        `;
    }
    if (dataSend.language === LANGUAGE.EN) {
        result = `<b>Hi ${dataSend.patientName}</b>
        <p>Thanks for getting in touch with us</p>
        <p>This is a confirmation email regarding your appointment. Here is your booking infomation:</p>    
        <ul><li>
            <b>Time:</b> ${dataSend.time}
        </li>
        <li>
            <b>Doctor:</b> ${dataSend.doctorName}
        </li>
        <li>
            <b>Address:</b> ${dataSend.address}
        </li>
        </ul>
        <p>If the infomation above is correct.Please click here to confirm your infomation: </p>
        <a href=${dataSend.redirectLink} target='_blank'>Click here</a>
        <p><b>Regards,</b></p>
        <p>Booking care VN.</p>
        `;
    }
    return result;
};
module.exports = {
    senSimpleEmail,
};
