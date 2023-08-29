"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class Doctor_Info extends Model {
        static associate(models) {
            // define association here
        }
    }
    Doctor_Info.init(
        {
            doctorId: DataTypes.INTEGER,
            priceId: DataTypes.STRING,
            provinceId: DataTypes.STRING,
            paymentId: DataTypes.STRING,
            clinicAddress: DataTypes.STRING,
            clinicName: DataTypes.STRING,
            note: DataTypes.STRING,
            count: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Doctor_Info",
            // freezeTableName: true,
        }
    );
    return Doctor_Info;
};
