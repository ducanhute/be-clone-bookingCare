"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Markdown extends Model {
        static associate(models) {
            Markdown.belongsTo(models.User, { foreignKey: "doctorId" });
        }
    }
    Markdown.init(
        {
            contentHTML: DataTypes.TEXT("long"),
            contentHTMLEn: DataTypes.TEXT("long"),
            contentMarkdown: DataTypes.TEXT("long"),
            contentMarkdownEn: DataTypes.TEXT("long"),
            description: DataTypes.TEXT("long"),
            descriptionEn: DataTypes.TEXT("long"),
            doctorId: DataTypes.INTEGER,
            specialtyId: DataTypes.INTEGER,
            clinicId: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Markdown",
            freezeTableName: true,
        }
    );
    return Markdown;
};
