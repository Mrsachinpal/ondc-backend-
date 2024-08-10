import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const ProductAttributeModel = sequelize.define('productsAttributeModel', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    seller: { type: DataTypes.STRING },
    product: { type: DataTypes.STRING },
    code: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING },
}, {
    strict: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
});

