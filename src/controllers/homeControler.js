import db from "../models/index";
import CRUDservice from "../services/CRUDService";
//
let getHomePage = async (req, res) => {
  try {
    let data = await db.User.findAll(); // tham chiếu tới bảng user trong db của chúng ta, await  giống như hàm đợi do truy cập đến db sẽ mất tg
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (e) {
    console.log(e);
  }
};
//
let getCRUD = (req, res) => {
  return res.render("crud.ejs");
};
//
let postCRUD = async (req, res) => {
  // Việc tạo người dùng tốn tg, req.body object chứa toàn bộ thông tin của form
  let message = await CRUDservice.createNewUser(req.body); // Đặt biến để hứng chuỗi mà resolve trả ra
  return res.send("post crud from server");
};
//
let displayGetCRUD = async (req, res) => {
  let data = await CRUDservice.getAllUser();
  return res.render("displayCRUD.ejs", {
    dataTable: data,
  }); // Truyền biến vào file view sử dụng object
};
//
let getEditCRUD = async (req, res) => {
  // lấy ra user id
  let userId = req.query.id;
  if (userId) {
    let userData = await CRUDservice.getUserInfoById(userId); // viết thêm hàm getUserInfoById trong services
    // console.log("User Data:", userData)
    return res.render("editCRUD.ejs", {
      user: userData, // Biến này sễ nhận được bên views trong file editCRUD.ejs
    });
  } else {
    return res.send("UserId not found!");
  }
};
//
let putCRUD = async (req, res) => {
  let data = req.body; // lấy đc tất cả các input trong file editCRUD.ejs: lấy name = req.body.name
  let allUsers = await CRUDservice.updateUserData(data);
  // Render lại dữ liệu giống như hàm edit
  return res.render("displayCRUD.ejs", {
    dataTable: allUsers,
  });
};
let deleteCRUD = async (req, res) => {
  // id là tham số truyền trên url
  let id = req.query.id; // do chúng ta dùng ?id= thì express sẽ hiểu ta cần tìm id ở đây
  if (id) {
    await CRUDservice.deleteUserById(id);
    return res.send("Delete user succeed");
  } else {
    return res.send("User not found");
  }
};
//

module.exports = {
  getHomePage: getHomePage,
  getCRUD: getCRUD,
  postCRUD: postCRUD,
  displayGetCRUD: displayGetCRUD,
  getEditCRUD: getEditCRUD,
  putCRUD: putCRUD,
  deleteCRUD: deleteCRUD,
};
