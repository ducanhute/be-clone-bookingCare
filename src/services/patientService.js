import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
import _ from "lodash";

let postBookAppointment = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((!data.email && !data.doctorId && !data.timeType) || !data.date) {
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
module.exports = {
    postBookAppointment,
};
