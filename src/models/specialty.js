"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class specialty extends Model {
        static associate(models) {}
    }
    specialty.init(
        {
            name: DataTypes.STRING,
            descriptionHTML: DataTypes.TEXT,
            descriptionMarkdown: DataTypes.TEXT,
            image: DataTypes.TEXT,
        },
        {
            sequelize,
            modelName: "specialty",
        }
    );
    return specialty;
};
