import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
import _ from "lodash";

require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let users = await db.User.findAll({
                where: {
                    roleId: "R2",
                },
                limit: limitInput,
                order: [["createdAt", "DESC"]],
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
                    { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
                ],
                raw: true,
                nest: true,
            });
            resolve({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let getAllDoctor = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let allDoctors = await db.User.findAll({
                where: {
                    roleId: "R2",
                },
                attributes: {
                    exclude: ["password", "image"],
                },
                raw: true,
            });
            resolve({
                errCode: 0,
                data: allDoctors,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let saveDetailInforDoctor = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let dataField = [
                "contentHTML",
                "contentMarkdown",
                "description",
                "doctorId",
                "action",
                "selectedPrice",
                "selectedPayment",
                "selectedProvince",
                "clinicName",
                "clinicAddress",
                "note",
            ];
            let errMessageField = [
                "Content Markdown",
                "Content Markdown",
                "Introduction information",
                "Choose your doctor",
                "Action",
                "Price",
                "Payment method",
                "Choose doctor's province",
                "Clinic Name",
                "Clinic Address",
                "Note",
            ];
            for (let i = 0; i < dataField.length; i++) {
                if (!data[dataField[i]]) {
                    resolve({
                        errCode: 1,
                        errMessage: `Missing ${errMessageField[i]} field`,
                    });
                }
            }
            // upset markdown table
            if (data.action === CRUD_ACTIONS.CREATE) {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
            } else if (data.action === CRUD_ACTIONS.EDIT) {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });
                if (doctorMarkdown) {
                    (doctorMarkdown.contentHTML = data.contentHTML),
                        (doctorMarkdown.contentMarkdown = data.contentMarkdown),
                        (doctorMarkdown.description = data.description),
                        // (doctorMarkdown.updatedAt = new Date()),
                        await doctorMarkdown.save();
                }
            }
            // Upsert infor doctor table
            let doctorInfor = await db.Doctor_Info.findOne({
                where: {
                    doctorId: data.doctorId,
                },
                raw: false,
            });
            if (doctorInfor) {
                // update
                (doctorInfor.priceId = data.selectedPrice),
                    (doctorInfor.provinceId = data.selectedProvince),
                    (doctorInfor.paymentId = data.selectedPayment),
                    (doctorInfor.clinicName = data.clinicName),
                    (doctorInfor.clinicAddress = data.clinicAddress),
                    (doctorInfor.note = data.note);
                await doctorInfor.save();
            } else {
                // create
                await db.Doctor_Info.create({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    provinceId: data.selectedProvince,
                    paymentId: data.selectedPayment,
                    clinicName: data.clinicName,
                    clinicAddress: data.clinicAddress,
                    note: data.note,
                });
            }
            resolve({
                errCode: 0,
                errMessage: "Save information doctor successfully",
            });
        } catch (error) {
            reject(error);
        }
    });
};
let getDetailDoctorById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        { model: db.Markdown, attributes: ["description", "contentMarkdown", "contentHTML"] },
                        { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
                        { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                { model: db.Allcode, as: "priceData" },
                                { model: db.Allcode, as: "paymentData" },
                                { model: db.Allcode, as: "provinceData" },
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (data && data.image) {
                    let imageBase64 = new Buffer(data.image, "base64").toString("binary");
                    data.image = imageBase64;
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            reject(error);
        }
    });
};
let bulkCreateSchedule = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                // Build data for save
                let schedule = data.arrSchedule;
                if (schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }
                let existingRecords = await db.schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.date },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                    raw: true,
                });
                // Compare client data with existing records
                let toCreate = _.differenceWith(schedule, existingRecords, (a, b) => {
                    return a.timeType === b.timeType && a.date === +b.date;
                });
                // If have the difference then save to database
                if (toCreate && toCreate.length > 0) {
                    await db.schedule.bulkCreate(toCreate);
                    resolve({
                        errCode: 0,
                        errMessage: "Save schedule Sucessfully",
                    });
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: "You had saved these schedules",
                    });
                }
            }
        } catch (error) {
            console.log(error);
        }
    });
};
let getScheduleByDate = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        { model: db.Allcode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] },
                        { model: db.User, as: "doctorData", attributes: ["firstName", "lastName"] },
                    ],
                    raw: false,
                    nest: true,
                });
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
        }
    });
};
let getExtraDoctorInfoById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: doctorId,
                    },
                    include: [
                        { model: db.Allcode, as: "priceData" },
                        { model: db.Allcode, as: "paymentData" },
                    ],
                    attributes: {
                        exclude: ["id", "doctorId"],
                    },
                    raw: false,
                    nest: true,
                });
                if (!data) data = [];
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
let getProfileDoctorById = (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        { model: db.Markdown, attributes: ["description", "contentMarkdown", "contentHTML"] },
                        { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
                        { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ["id", "doctorId"],
                            },
                            include: [
                                { model: db.Allcode, as: "priceData" },
                                { model: db.Allcode, as: "paymentData" },
                                { model: db.Allcode, as: "provinceData" },
                            ],
                        },
                    ],
                    raw: true,
                    nest: true,
                });
                if (data && data.image) {
                    let imageBase64 = new Buffer(data.image, "base64").toString("binary");
                    data.image = imageBase64;
                }
                if (!data) {
                    data = {};
                }
                resolve({
                    errCode: 0,
                    data: data,
                });
            }
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
};
module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraDoctorInfoById,
    getProfileDoctorById,
};
