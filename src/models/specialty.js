// "use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class specialty extends Model {
        static associate(models) {}
    }
    specialty.init(
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
            modelName: "specialty",
        }
    );
    return specialty;
};
