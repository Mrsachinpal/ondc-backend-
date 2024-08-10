import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const variantGroup = sequelize.define('variantGroup', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    organization: { type: DataTypes.STRING },
    name: { type: DataTypes.TEXT },

}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

variantGroup.sync();

export default variantGroup;