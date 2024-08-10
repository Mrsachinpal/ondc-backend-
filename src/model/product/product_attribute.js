import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const ProductAttribute = sequelize.define('ProductAttributes', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    ondc_product_id: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    variant_id: {
        type: DataTypes.STRING
    },
    attribute_name: {
        type: DataTypes.STRING
    },
    attribute_value: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at"
});

ProductAttribute.sync();
