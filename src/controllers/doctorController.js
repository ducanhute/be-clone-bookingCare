import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
    // console.log("hihi", req.query);
    let limit = req.query.limit;
    if (!req.query.limit) {
        limit = 10;
    }
    try {
        let doctors = await doctorService.getTopDoctorHome(+limit);
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let getAllDoctor = async (req, res) => {
    try {
        let allDoctors = await doctorService.getAllDoctor();
        return res.status(200).json(allDoctors);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};
let postInfoDoctor = async (req, res) => {
    try {
        let respond = await doctorService.saveDetailInforDoctor(req.body);
        return res.status(200).json(respond);
    } catch (error) {
        console.log(error);
        return res.status(200).json({
            errCode: -1,
            message: "Error from server...",
        });
    }
};

module.exports = { getTopDoctorHome, getAllDoctor, postInfoDoctor };
