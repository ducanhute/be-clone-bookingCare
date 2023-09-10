// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Specialty extends Model {
        static associate(models) {}
    }
    Specialty.init(
        {
            nameVi: DataTypes.STRING,
            descriptionHTMLVi: DataTypes.TEXT,
            descriptionMarkdownVi: DataTypes.TEXT,
            nameEn: DataTypes.STRING,
            descriptionHTMLEn: DataTypes.TEXT,
            descriptionMarkdownEn: DataTypes.TEXT,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "Specialty",
            freezeTableName: true,
        }
    );
    return Specialty;
};
