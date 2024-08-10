import { DataTypes } from 'sequelize';
import { sequelize } from '../../db/index.js';

export const variantValue = sequelize.define('variantValue', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organizationId: { type: DataTypes.STRING },
    variantType: { type: DataTypes.STRING },
    value: { type: DataTypes.STRING },
    product: { type: DataTypes.BOOLEAN },
    createdBy: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

variantValue.sync();
