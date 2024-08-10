import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const CustomMenuProduct = sequelize.define('customMenuProduct', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    organization: {
        type: DataTypes.STRING
    },
    customMenu: {
        type: DataTypes.STRING
    },
    seq: {
        type: DataTypes.INTEGER
    },
    product:{
        type:DataTypes.STRING, ref: 'Product'
    },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});