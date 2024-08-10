import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const productCustomization = sequelize.define('productCustomization', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    pid: { type: DataTypes.STRING, allowNull: false },
    organization: { type: DataTypes.STRING },
    default: { type: DataTypes.STRING, default: 'No' },
    name: { type: DataTypes.STRING },
    price: { type: DataTypes.INTEGER },
    inStock: { type: DataTypes.BOOLEAN },
    parent: { type: DataTypes.STRING },
    parentId: { type: DataTypes.STRING },
    product: { type: DataTypes.STRING },
    childId: { type: DataTypes.STRING },
    child: { type: DataTypes.STRING },
    UOM: { type: DataTypes.STRING },
    UOMValue: { type: DataTypes.STRING },
    available: { type: DataTypes.STRING },
    maximum: { type: DataTypes.STRING },
    vegNonVeg: { type: DataTypes.STRING },
    createdBy: { type: DataTypes.STRING },
    updatedBy: { type: DataTypes.STRING },
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

productCustomization.sync()
