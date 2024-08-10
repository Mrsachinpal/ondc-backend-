import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";


export const variantType = sequelize.define('variantType', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: { type: DataTypes.STRING },
    name: { type: DataTypes.STRING },
    category: { type: DataTypes.STRING },
    subCategory: { type: DataTypes.STRING },
    createdBt: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

variantType.sync();