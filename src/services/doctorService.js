import db from "../models/index";
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
            if (!data.doctorId || !data.contentHTML || !data.contentMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.Markdown.create({
                    contentHTML: data.contentHTML,
                    contentMarkdown: data.contentMarkdown,
                    description: data.description,
                    doctorId: data.doctorId,
                });
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

module.exports = {
    getTopDoctorHome,
    getAllDoctor,
    saveDetailInforDoctor,
};
