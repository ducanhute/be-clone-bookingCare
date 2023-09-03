import clinicService from "../services/clinicService";
let createClinic = async (req, res) => {
    try {
        let respond = await clinicService.createClinic(req.body);
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getAllClinic = async (req, res) => {
    try {
        let respond = await clinicService.getAllClinic();
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getDetailClinicById = async (req, res) => {
    try {
        let respond = await clinicService.getDetailClinicById(req.query.id);
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
module.exports = {
    createClinic,
    getAllClinic,
    getDetailClinicById,
};
