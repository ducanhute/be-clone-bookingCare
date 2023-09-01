import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
import _, { reject } from "lodash";
import { senSimpleEmail } from "../services/emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
    let result = `${process.env.REACT_URL}/verify-booking?token=${token}=&doctorId=${doctorId}`;
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
                // Semd confirm mail
                let token = uuidv4();
                await senSimpleEmail({
                    patientName: data.fullName,
                    doctorName: "Hung Dang Viet",
                    time: data.timeString,
                    redirectLink: buildUrlEmail(data.doctorId, token),
                    language: data.language,
                    doctorName: data.doctorName,
                    address: data.address,
                });
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
                    // await db.Booking.findOrCreate({
                    //     where: {
                    //         patientId: user[0].id,
                    //     },
                    //     defaults: {
                    //         statusId: "S1",
                    //         doctorId: data.doctorId,
                    //         patientId: user[0].id,
                    //         date: data.date,
                    //         timeType: data.timeType,
                    //     },
                    // });
                    let booking = await db.Booking.findOne({
                        where: {
                            patientId: user[0].id,
                        },
                        raw: false,
                    });
                    if (booking) {
                        (booking.statusId = "S1"),
                            (booking.doctorId = data.doctorId),
                            (booking.date = data.date),
                            (booking.timeType = data.timeType),
                            // (booking.token = token);
                            await booking.save();
                        resolve({
                            errCode: 0,
                            errMessage: "Update booking infomation successfully",
                        });
                    } else {
                        await db.Booking.create({
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token,
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
