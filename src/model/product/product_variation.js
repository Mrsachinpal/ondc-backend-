import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const ProductVariation = sequelize.define('ProductVariations', {
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
    title: {
        type: DataTypes.STRING
    }, 
    inventory_quantity: {
        type: DataTypes.INTEGER
    },
    sku: {
        type: DataTypes.STRING
    },
    mrp: {
        type: DataTypes.DOUBLE
    },
    selling_price: {
        type: DataTypes.DOUBLE
    },
    uom: {
        type: DataTypes.STRING
    },
    weight: {
        type: DataTypes.FLOAT
    },
    shipment_weight: {
        type: DataTypes.FLOAT
    },
    image: {
        type: DataTypes.TEXT
    },
    feature:{
        type: DataTypes.JSON
    },
    status: {
        type: DataTypes.BOOLEAN
    },
    gst: {
        type: DataTypes.FLOAT
    },
}, {
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at"
});
ProductVariation.sync();
