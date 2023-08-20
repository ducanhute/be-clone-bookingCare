import db from "../models";
import userService from "../services/userService";
import CRUDservice from "../services/CRUDService";

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: "Missing inputs parameter!",
        });
    }
    // trả về user data đc xử lý bên service
    let userData = await userService.handleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.erroMessage,
        user: userData.user ? userData.user : {},
    });
};
let handleGetAllUsers = async (req, res) => {
    let id = req.query.id; // All, id= một user.Sd query thể hiện t đang truyền dưới dạn tham số trên đường link
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            erroMessage: "Missing parameter id",
            users: [],
        });
    }
    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        erroMessage: "ok",
        users,
    });
};
// 3 funtion tiếp theo là thêm sửa xóa khi client gọi API gửi yêu cầu
let handleCreateNewUsers = async (req, res) => {
    // Hứng message: gọi createNewUser và truyền vào data từ client: req.body
    let message = await userService.createNewUser(req.body);
    // Giá trị trả về khi gọi API từ client
    return res.status(200).json(message);
};
let handleEditUsers = async (req, res) => {
    let data = req.body;
    let message = await userService.updateUserData(data);
    return res.status(200).json(message);
};
let handleDeleteUsers = async (req, res) => {
    if (!req.body.id) {
        // Nếu không truyền vào Id trả về errCode 1
        return res.status(200).json({
            errCode: 1,
            message: "Missing required parameter: Id",
        });
    }
    // Nếu truyền vào Id thực hiện hàm deleteNewUser
    let message = await userService.deleteNewUser(req.body.id);
    return res.status(200).json(message);
};

let getAllCode = async (req, res) => {
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            erroMessage: "Error from server",
        });
    }
};

module.exports = {
    handleLogin: handleLogin,
    handleGetAllUsers: handleGetAllUsers,
    handleCreateNewUsers: handleCreateNewUsers,
    handleEditUsers: handleEditUsers,
    handleDeleteUsers: handleDeleteUsers,
    getAllCode: getAllCode,
};
