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
            console.log(res);
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

module.exports = {
    crateSpecialty,
    getAllSpecialty,
};
