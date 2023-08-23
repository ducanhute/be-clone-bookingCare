import db from "../models/index";
import { CRUD_ACTIONS } from "../utils/constant";
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
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown || !data.action) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
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
                    console.log("Check doctorMarkdown", doctorMarkdown);
                    if (doctorMarkdown) {
                        (doctorMarkdown.contentHTML = data.contentHTML),
                            (doctorMarkdown.contentMarkdown = data.contentMarkdown),
                            (doctorMarkdown.description = data.description),
                            // (doctorMarkdown.updatedAt = new Date()),
                            await doctorMarkdown.save();
                    }
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save information doctor successfully",
                });
            }
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
                    ],
                    raw: true,
                    nest: true,
                });
                if (data && data.image) {
                    let imageBase64 = new Buffer(data.image, "base64").toString("binary");
                    data.image = imageBase64;
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
module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
    getDetailDoctorById,
};
