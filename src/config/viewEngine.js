import express from "express";
//  Câu lệnh cũ: var express = require('express')
let configViewEngine = (app) => {
    // Cấu hình đường link static (Giống như khai báo src cho phía client có thể truy cập)
    app.use(express.static("./src/public")) //  vd muốn lấy một cái ảnh trên server ta bắt buộc nói cho thằng express biết chỉ đc lấy trong public
    app.set("view engine", "ejs") // Set view là thư viện view js, giúp ta có thể gõ đc các câu lệnh logic trong file html
    app.set("views", "./src/views")// set đường link
}
module.exports = configViewEngine;
