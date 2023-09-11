import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
import _, { reject } from "lodash";
import emailService from "../services/emailService";

require("dotenv").config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limitInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            let limit = 0;
            if (limitInput) {
                limitInput = limitInput;
            } else {
                limitInput = 10000;
            }
            let users = await db.User.findAll({
                where: {
                    roleId: "R2",
                },
                limit: limitInput,
                offset: 21,
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
                "contentHTMLEn",
                "contentMarkdown",
                "contentMarkdownEn",
                "description",
                "descriptionEn",
                "doctorId",
                "action",
                "selectedPrice",
                "selectedPayment",
                "selectedProvince",
                "clinicName",
                "clinicNameEn",
                "clinicAddress",
                "clinicAddressEn",
                "note",
                "noteEn",
                "clinicId",
                "specialtyId",
            ];
            let errMessageField = [
                "Vietnamese Content Markdown",
                "English Content Markdown",
                "Vietnamese Content HTML",
                "English Content HTML",
                "Vietnamese Introduction information",
                "English Introduction information",
                "Choose your doctor",
                "Action",
                "Price",
                "Payment method",
                "Choose doctor's province",
                "Clinic Vietnamese Name",
                "Clinic English Name",
                "Clinic Vietnamese Address",
                "Clinic English Address",
                "Vietnamese Note",
                "English Note",
                "Clinic",
                "Specialty",
            ];
            for (let i = 0; i < dataField.length; i++) {
                if (!data[dataField[i]]) {
                    return resolve({
                        errCode: 1,
                        errMessage: `Missing ${errMessageField[i]} field`,
                    });
                }
            }
            // upset markdown table
            if (data.action === CRUD_ACTIONS.CREATE) {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentHTMLEn: data.contentHTMLEn,
                    contentMarkdown: data.contentMarkdown,
                    contentMarkdownEn: data.contentMarkdownEn,
                    description: data.description,
                    descriptionEn: data.descriptionEn,
                    doctorId: data.doctorId,
                });
            } else if (data.action === CRUD_ACTIONS.EDIT) {
                let doctorMarkdown = await db.Markdown.findOne({
                    where: { doctorId: data.doctorId },
                    raw: false,
                });
                if (doctorMarkdown) {
                    (doctorMarkdown.contentHTML = data.contentHTML),
                        (doctorMarkdown.contentHTMLEn = data.contentHTMLEn),
                        (doctorMarkdown.contentMarkdown = data.contentMarkdown),
                        (doctorMarkdown.contentMarkdownEn = data.contentMarkdownEn),
                        (doctorMarkdown.description = data.description),
                        (doctorMarkdown.descriptionEn = data.descriptionEn),
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
                    (doctorInfor.clinicNameEn = data.clinicNameEn),
                    (doctorInfor.clinicAddress = data.clinicAddress),
                    (doctorInfor.clinicAddress = data.clinicAddress),
                    (doctorInfor.clinicAddressEn = data.clinicAddressEn),
                    (doctorInfor.note = data.note),
                    (doctorInfor.noteEn = data.noteEn),
                    (doctorInfor.clinicId = data.clinicId),
                    (doctorInfor.specialtyId = data.specialtyId),
                    await doctorInfor.save();
            } else {
                // create
                await db.Doctor_Info.create({
                    doctorId: data.doctorId,
                    priceId: data.selectedPrice,
                    provinceId: data.selectedProvince,
                    paymentId: data.selectedPayment,
                    clinicName: data.clinicName,
                    clinicNameEn: data.clinicNameEn,
                    clinicAddress: data.clinicAddress,
                    clinicAddressEn: data.clinicAddressEn,
                    note: data.note,
                    noteEn: data.noteEn,
                    clinicId: data.clinicId,
                    specialtyId: data.specialtyId,
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
                        id: +id,
                    },
                    attributes: {
                        exclude: ["password"],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ["description", "contentMarkdown", "contentHTML", "descriptionEn", "contentMarkdownEn", "contentHTMLEn"],
                        },
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
                    let imageBase64 = new Buffer.from(data.image, "base64").toString("binary");
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
                let existingRecords = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: "" + data.date },
                    attributes: ["timeType", "date", "doctorId", "maxNumber"],
                    raw: true,
                });
                // Compare client data with existing records
                let toCreate = _.differenceWith(schedule, existingRecords, (a, b) => {
                    return a.timeType === b.timeType && a.date === +b.date;
                });
                // If have the difference then save to database
                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
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
                let data = await db.Schedule.findAll({
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
                        {
                            model: db.Markdown,
                            attributes: ["description", "contentMarkdown", "contentHTML", "descriptionEn", "contentMarkdownEn", "contentHTMLEn"],
                        },
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
                    let imageBase64 = new Buffer.from(data.image, "base64").toString("binary");
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
let getListPatientForDoctor = (doctorId, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId && !date) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        statusId: "S2",
                        doctorId: doctorId,
                        date: date,
                    },
                    include: [
                        {
                            model: db.User,
                            as: "patientData",
                            attributes: ["email", "gender", "firstName", "phoneNumber", "address"],
                            include: [{ model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] }],
                        },
                        {
                            model: db.Allcode,
                            as: "timeTypeDataPatient",
                            attributes: ["valueEn", "valueVi"],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                resolve({
                    errCode: 0,
                    errMessage: "ok",
                    data: data,
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let sendRemedy = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                // update patient status
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        patientId: data.patientId,
                        timeType: data.timeType,
                        statusId: "S2",
                    },
                    raw: false,
                });
                if (appointment) {
                    (appointment.statusId = "S3"), await appointment.save();
                }
                // send email remedy
                emailService.sendAttachment(data);
                resolve({
                    errCode: 0,
                    errMessage: "ok",
                });
            }
        } catch (e) {
            reject(e);
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
    getListPatientForDoctor,
    sendRemedy,
};
