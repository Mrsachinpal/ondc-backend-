import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

const SearchRequest = sequelize.define('SearchRequest', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    messageId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    domain: {
        type: DataTypes.STRING,
        allowNull: false
    },
    bapId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    onSearchResponse: {
        type: DataTypes.JSONB,
        allowNull: true
    }

}, {
    freezeTableName: true
});

export default SearchRequest;
