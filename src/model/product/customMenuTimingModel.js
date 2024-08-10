import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const CustomMenuTiming = sequelize.define('customMenuTiming', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    oraganization: {
        type: DataTypes.STRING
    },
    customMenu: {
        type: DataTypes.STRING
    },
    timings: {
        type: DataTypes.TEXT
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});