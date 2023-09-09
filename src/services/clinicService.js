const { reject } = require("lodash");
const db = require("../models");

let createClinic = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if ((!data.name && !data.imageBase64 && !data.descriptionHTML) || !data.descriptionMarkdown || !data.address) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter",
                });
            } else {
                await db.clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    address: data.address,
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

let getAllClinic = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.clinic.findAll({
                attributes: ["id", "descriptionHTML", "descriptionMarkdown", "name", "image", "nameEn"],
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
let getDetailClinicById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    err: 1,
                    errMessage: "Missing parameter",
                });
            } else {
                let data = await db.clinic.findOne({
                    where: {
                        id: id,
                    },
                    attributes: ["descriptionHTML", "descriptionMarkdown", "name"],
                });
                if (data) {
                    let doctorClinic = [];
                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: id,
                        },
                        attributes: ["doctorId", "provinceId"],
                    });
                    data.doctorClinic = doctorClinic;
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
    createClinic,
    getAllClinic,
    getDetailClinicById,
};
