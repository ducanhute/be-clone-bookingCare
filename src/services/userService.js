import db from "../models/index"; // import db để sử truy cập db để check
import bcrypt from "bcryptjs"; // Ta dùng thư viện nào để hash password thì dùng thư  viện đó để giải mã
const salt = bcrypt.genSaltSync(10); // Thuật toán sử dụng để hashPassword
let handleUserLogin = (email, password) => {
    return new Promise(async (reslove, reject) => {
        try {
            let userData = {}; // trả về thông báo cho người dùng
            let isExit = await checkUerEmail(email);
            // If email exists
            if (isExit) {
                // Tìm đến user có email khớp trong hệ thống
                let user = await db.User.findOne({
                    attributes: ["email", "roleId", "password", "firstName", "lastName"],
                    where: { email: email },
                    raw: true,
                });
                // check  lại lần nữa tránh  tình trạng user bị xóa sau bất ngờ
                if (user) {
                    // Check password
                    let check = await bcrypt.compareSync(password, user.password);
                    if (check) {
                        userData.errCode = 0;
                        userData.erroMessage = "ok";
                        delete user.password;
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.erroMessage = "Wrong password";
                    }
                } else {
                    userData.errCode = 2;
                    userData.erroMessage = `User not found`;
                }
            } else {
                // If email does not exist
                userData.errCode = 1;
                userData.erroMessage = `Your's Email isn't exits.Please try other email`;
            }
            reslove(userData);
        } catch (e) {
            reject(e);
        }
    });
};
// check email có tồn tại trong hệ thống hay chưa: trả về true hoặc false
let checkUerEmail = (userEmail) => {
    return new Promise(async (reslove, reject) => {
        // việc check dưới db sẽ mất thời gian sử dụng promise để ngăn tình trạng bất đồng bộ
        try {
            let user = await db.User.findOne({
                where: { email: userEmail },
            });
            if (user) {
                reslove(true);
            } else {
                reslove(false);
            }
        } catch (e) {
            reject(e);
        }
    });
};
let getAllUsers = (userId) => {
    return new Promise(async (reslove, reject) => {
        try {
            let users = "";
            if (userId === "All") {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ["password"],
                    },
                });
            }
            if (userId && userId !== "All") {
                users = await db.User.findOne({
                    where: { id: userId },
                    attributes: {
                        exclude: ["password"],
                    }, // userId truyền vào phải bằng code id trong db
                });
            }
            reslove(users);
        } catch (e) {
            reject(e);
        }
    });
};

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Check email exits
            let check = await checkUerEmail(data.email);
            if (check) {
                resolve({
                    errCode: 1,
                    errMessage: "Your email is already in used, Please try another email.",
                });
            } else {
                let hashPasswordFromBscrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBscrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.role,
                    positionId: data.position,
                    image: data.avatar,
                });
                resolve({
                    errCode: 0, // errCode = 0 nghĩa là ta đã tạo đc người dùng
                    message: "OK",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};
// copy from CRUDService
let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt); // chờ thư viện băm mk ra
            resolve(hashPassword); // tương tự như return
        } catch (e) {
            reject(e);
        }
    });
};
let deleteNewUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                // Hàm findOne tạo ra bởi thư viện sequelize
                where: { id: userId },
            });
            if (!user) {
                // Nếu không tìm thấy user
                resolve({
                    errCode: 2,
                    message: "The user is not exist",
                });
            }
            // await user.destroy(); // Muốn sd cách này thì user phải là instane của sequelize.Phải set lại: draw= false
            await db.User.destroy({
                where: { id: userId },
            });
            resolve({
                errCode: 0,
                message: "The user is deleted",
            });
        } catch (e) {
            reject(e);
        }
    });
};
let updateUserData = (data) => {
    return new Promise(async (reslove, reject) => {
        try {
            if (!data.id || !data.role || !data.position || !data.gender) {
                reslove({
                    errCode: 2,
                    errMessage: "Missing required parameter",
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false,
            });
            if (user) {
                // Có user thì lưu lại thông tin người dùng
                (user.firstName = data.firstName),
                    (user.lastName = data.lastName),
                    (user.address = data.address),
                    (user.roleId = data.role),
                    (user.positionId = data.position),
                    (user.gender = data.gender),
                    (user.phoneNumber = data.phoneNumber),
                    (user.image = data.avatar);
                await user.save();
                // Trả vể errCode và message
                reslove({
                    errCode: 0,
                    message: "Update the user succeeds!",
                });
            } else {
                reslove({
                    errCode: 1,
                    message: "User not found",
                });
            }
        } catch (e) {
            reject(e);
        }
    });
};

let getAllCodeService = (inputType) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!inputType) {
                resolve({
                    errCode: 0,
                    erroMessage: "Missing parameter",
                });
            } else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {
                        type: inputType,
                    },
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    handleUserLogin: handleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteNewUser: deleteNewUser,
    updateUserData: updateUserData,
    getAllCodeService: getAllCodeService,
};
