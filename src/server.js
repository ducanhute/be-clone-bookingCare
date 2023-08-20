// Cấu hình một số thứ cần thiết
import express from "express";
import bodyParser from "body-parser"; // hộ trợ lấy các tham số phía client sử dụng cho chúng ta
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors"; // Thư viện fix lỗi cors khi gọi API
require("dotenv").config(); // sử dụng câu lệnh này ta sẽ gọi đến được hàm config của thư viện dotenv => giúp ta chạy đc process.env.PORT
// đây là một instane của thằng  express
let app = express();
// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", process.env.REACT_URL);

    // Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");

    // Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});
// config app
// app.use(bodyParser.json()) //  cấu hinh các tham số client gửi lên
// app.use(bodyParser.urlencoded({ extended: true })) // cấu hinh các tham số client gửi lên
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
viewEngine(app);
initWebRoutes(app);
connectDB();
// sau khi config xong để chạy đc
let port = process.env.PORT || 6969; // để lấy một tham số trong file env ta sử dụng câu lệnh process.env
// Port === undefined => port = 6969
app.listen(port, () => {
    console.log("backed nodejs is running on the port : " + port);
});
