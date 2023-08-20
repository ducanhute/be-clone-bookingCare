// thằng services có nhiệm cụ nhận data từ controllers
import bcrypt from "bcryptjs";
import db from "../models/index";
import User from "../models/user";
const salt = bcrypt.genSaltSync(10); // Thuật toán sử dụng để hashPassword

let createNewUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPasswordFromBscrypt = await hashUserPassword(data.password);
      await db.User.create({
        email: data.email,
        password: hashPasswordFromBscrypt,
        firstName: data.firstName,
        lastName: data.lastName,
        address: data.address,
        phonenumber: data.phonenumber,
        gender: data.gender === "1" ? true : false,
        roleId: data.roleId,
      });
      resolve("ok create a new Uses succeed!");
    } catch (e) {
      reject(e);
    }
  });
};
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
let getAllUser = () => {
  // Sử dụng Promise để ngăn chặn tình trạng bất đồng bộ:
  // Nói với thằng js : t có 1 promise ở đây, khi nào thực hiện xong mới chạy tiếp
  return new Promise(async (resolve, reject) => {
    try {
      let users = db.User.findAll({
        raw: true,
      });
      resolve(users);
    } catch (e) {
      // ví như kết nối db mà bị fail luồng code sẽ đi ngay vào catch
      reject(e);
    }
  });
};
let getUserInfoById = (userId) => {
  return new Promise(async (resolve, reject) => {
    // Một hàm kết nối đến Db ngăn chặn sự ko đồng bộ ta sử dụng promise
    try {
      let user = await db.User.findOne({
        where: { id: userId }, // tìm một user trong db có id = userId truyền vào hàm
        raw: true,
      });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (e) {
      reject(e);
    }
  });
};
// Hàm update data đc truyền cào hàm putCRUD
let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.update(
        {
          firstName: data.firstName,
          lastName: data.lastName,
          address: data.address,
        },
        {
          where: {
            id: data.id,
          },
        }
      );

      let allUsers = await db.User.findAll();
      resolve(allUsers);
    } catch (e) {
      console.log(e);
    }
  });
};
let deleteUserById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId }, // lấy giá trị của userId gán cho Id
      });
      if (user) {
        await db.User.destroy({
          where: {
            id: userId,
          },
        });
      }
      resolve(); // giống return giúp ta thoát ra khỏi 1 hàm
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
  createNewUser,
  getAllUser: getAllUser, // Lấy tất cả người dùng trả về cho controllers
  getUserInfoById: getUserInfoById,
  updateUserData: updateUserData,
  deleteUserById: deleteUserById,
};
