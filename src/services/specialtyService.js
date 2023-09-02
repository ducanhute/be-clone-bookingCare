const { reject } = require("lodash");
const db = require("../models");

let crateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((!data.name && !data.imageBase64 && !data.descriptionHTML) || !data.descriptionMarkdown) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                resolve({
                    errCode: 0,
                    errMessage: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllSpecialty = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.specialty.findAll({
                attributes: {
                    exclude: [""],
                },
            });
            if (res && res.length > 0) {
                res = res.map((item) => {
                    item.image = new Buffer(item.image, "base64").toString("binary");
                    return item;
                });
            }
            resolve({
                errCode: 0,
                errMessage: "OK",
                data: res,
            });
        } catch (e) {
            reject(e);
        }
    });
};
let getDetailSpecialtyById = (id, location) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !location) {
                resolve({
                    err: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                let data = {};

                data = await db.specialty.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ["descriptionHTML", "descriptionMarkdown"],
                });
                if (data) {
                    let doctorSpecialty = [];
                    // find all doctor with same specialty
                    if (location === "ALL") {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id },
                            attributes: ["doctorId", "provinceId"],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: { specialtyId: id, provinceId: location },
                            attributes: ["doctorId", "provinceId"],
                        });
                    }
                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};
                resolve({
                    errMessage: "OK",
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
    crateSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};
