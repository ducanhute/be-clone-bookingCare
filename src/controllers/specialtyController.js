import specialtyService from "../services/specialtyService";
let crateSpecialty = async (req, res) => {
    try {
        let respond = await specialtyService.crateSpecialty(req.body);
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getAllSpecialty = async (req, res) => {
    try {
        let respond = await specialtyService.getAllSpecialty();
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getDetailSpecialtyById = async (req, res) => {
    try {
        let respond = await specialtyService.getDetailSpecialtyById(req.query.id, req.query.location);
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
    crateSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};
