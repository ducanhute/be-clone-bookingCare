import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
import _, { reject } from "lodash";
import { senSimpleEmail } from "../services/emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.REACT_URL}/verify-booking?token=${token}&doctorId=${doctorId}`;
    return result;
};
let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((!data.email && !data.doctorId && !data.timeType) || !data.date || !data.language) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                // If find user return user else create new user
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email,
                    },
                    defaults: {
                        email: data.email,
                        roleId: "R3",
                    },
                });
                // If patient does not have booked an apointment before the create a new one
                // otherwise update the existing one
                if (user && user[0]) {
                    let booking = await db.Booking.findOne({
                        where: {
                            patientId: user[0].id,
                        },
                        raw: false,
                    });
                    // User have booked appointment
                    if (booking) {
                        (booking.statusId = "S1"),
                            (booking.doctorId = data.doctorId),
                            (booking.date = data.date),
                            (booking.timeType = data.timeType),
                            await booking.save();
                        await senSimpleEmail({
                            patientName: data.fullName,
                            time: data.timeString,
                            redirectLink: buildUrlEmail(data.doctorId, booking.token),
                            language: data.language,
                            doctorName: data.doctorName,
                            address: data.address,
                        });
                        resolve({
                            errCode: 0,
                            errMessage: "Update booking infomation successfully",
                        });
                    } else {
                        // user havenot booked appointment
                        let token = uuidv4();
                        await db.Booking.create({
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
                        });
                        // Semd confirm mail
                        await senSimpleEmail({
                            patientName: data.fullName,
                            time: data.timeString,
                            redirectLink: buildUrlEmail(data.doctorId, token),
                            language: data.language,
                            doctorName: data.doctorName,
                            address: data.address,
                        });
                        resolve({
                            errCode: 0,
                            errMessage: "Create booking infomation successfully",
                        });
                    }
                }
            }
        } catch (e) {
            reject(e);
        }
    });
};
let postVerifyBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.token) {
                resolve({
                    erroCode: 1,
                    errMessage: "Missing parameter!",
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1",
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = "S2";
                    await appointment.save();
                    resolve({
                        errCode: 0,
                        errMessage: "Confirmed successfully",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or doesn't exit",
                    });
                }
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    postBookAppointment,
    postVerifyBookAppointment,
};
