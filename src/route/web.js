// Mỗi lần truy cập đường link webside thì sẽ đi vào file này đầu tiên
import express from "express";
import homeController from "../controllers/homeControler";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
let router = express.Router();
// App giống như chỉ 1 server 1 ứng dụng của ta
let initWebRoutes = (app) => {
    router.get("/", homeController.getHomePage); // Ta đã tạo đc 1 router hay đường link, nếu ta truy cập vào server thì sẽ thấy đc Hello word
    //Res API
    router.get("/crud", homeController.getCRUD);
    // Ở đây ta đang sử dụng post do ta create a user và đẩy nó vào database
    router.post("/post-crud", homeController.postCRUD);
    // display data from database
    router.get("/get-crud", homeController.displayGetCRUD);
    //Chuyển đến trang sửa dữ liệu
    router.get("/edit-crud", homeController.getEditCRUD);
    // Cấu hình trang chuyển đến khi nhấn update
    router.post("/put-crud", homeController.putCRUD);
    // Delete ở đây chúng ta sử dụng phương thức get chứ ko phải post: do click vào một dường link ta phải gender ra dữ liệu
    router.get("/delete-crud", homeController.deleteCRUD);
    // Thêm rout API user
    router.post("/api/login", userController.handleLogin);
    // API get all user
    router.get("/api/get-all-users", userController.handleGetAllUsers);
    //Api cập nhật thông tin sử dụng cho phía ReactJS: create, edit, delete
    router.post("/api/create-new-user", userController.handleCreateNewUsers);
    router.put("/api/edit-user", userController.handleEditUsers); // edit thì sd phương thức put: chuẩn resAPI
    router.delete("/api/delete-user", userController.handleDeleteUsers);
    router.get("/api/allcode", userController.getAllCode);
    router.get("/api/top-doctor-home", doctorController.getTopDoctorHome);
    router.get("/api/all-doctor", doctorController.getAllDoctor);
    router.post("/api/save-info-doctor", doctorController.postInfoDoctor);
    router.get("/api/get-detail-doctor-by-id", doctorController.getDetailDoctorById);
    router.post("/api/bulk-create-schedule", doctorController.bulkCreateSchedule);
    router.get("/api/get-schedule-doctor-by-date", doctorController.getScheduleByDate);
    router.get("/api/get-extra-doctor-info-by-id", doctorController.getExtraDoctorInfoById);
    router.get("/api/get-profile-doctor-by-id", doctorController.getProfileDoctorById);

    return app.use("/", router);
};
module.exports = initWebRoutes;
