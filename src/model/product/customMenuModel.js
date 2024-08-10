import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const customMenuSchema = sequelize.define('customMenu', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    menuId: {
        type: DataTypes.STRING,
    },
    organization: {
        type: DataTypes.STRING
    },
    name: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.STRING
    },
    seq: {
        type: DataTypes.INTEGER
    },
    longDescription: {
        type: DataTypes.STRING
    },
    shortDescription: {
        type: DataTypes.STRING
    },
    images: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});