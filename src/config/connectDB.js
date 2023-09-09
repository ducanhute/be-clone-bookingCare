const { Sequelize } = require("sequelize");

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("clone_bookingCare_db", "root", null, {
    host: "localhost",
    dialect: "mysql",
    logging: false,
});
// Tạo hàm thông báo khi kết nối thành công, async thông báo đây là hàm bất đồng bộ
let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};

module.exports = connectDB;
