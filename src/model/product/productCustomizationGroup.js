import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";


export const productCustomizationGroup = sequelize.define('productCustomizationGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    productId: { type: DataTypes.STRING, allowNull: false },
    organization: { type: DataTypes.STRING, ref: 'Organization' },
    product: { type: DataTypes.STRING, ref: 'Product' },
    name: { type: DataTypes.STRING },
    defaultCustomizationId: { type: DataTypes.STRING },
    isMandatory: { type: DataTypes.BOOLEAN },
    inputType: { type: DataTypes.STRING },
    minQuantity: { type: DataTypes.INTEGER },
    maxQuantity: { type: DataTypes.INTEGER },
    seq: { type: DataTypes.INTEGER },
    createdBy: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

productCustomizationGroup.sync();