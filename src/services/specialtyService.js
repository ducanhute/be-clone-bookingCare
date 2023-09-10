const { reject } = require("lodash");
const db = require("../models");

let crateSpecialty = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (
                !data.name &&
                !data.imageBase64 &&
                !data.descriptionHTMLVi &&
                !data.descriptionMarkdownVi &&
                !data.descriptionHTMLEn &&
                !data.descriptionMarkdownEn
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.Specialty.create({
                    nameVi: data.nameVi,
                    nameEn: data.nameEn,
                    image: data.imageBase64,
                    descriptionHTMLVi: data.descriptionHTMLVi,
                    descriptionHTMLEn: data.descriptionHTMLEn,
                    descriptionMarkdownVi: data.descriptionMarkdownVi,
                    descriptionMarkdownEn: data.descriptionMarkdownEn,
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
            let res = await db.Specialty.findAll({
                attributes: {
                    exclude: [""],
                },
            });
            if (res && res.length > 0) {
                res = res.map((item) => {
                    item.image = new Buffer.from(item.image, "base64").toString("binary");
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

                data = await db.Specialty.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ["descriptionHTMLVi", "descriptionMarkdownVi", "descriptionHTMLEn", "descriptionMarkdownEn"],
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
