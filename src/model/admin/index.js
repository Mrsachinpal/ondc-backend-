import { DataTypes } from 'sequelize';
import { sequelize } from "../../db/index.js";

export const userDetails = sequelize.define('userDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    providerId: {
        type: DataTypes.STRING,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    mobileNumber: {
        type: DataTypes.STRING,
    },
    Orgname: {
        type: DataTypes.STRING,
    },
    password: {
        type: DataTypes.STRING,
    },
    role: {
        type: DataTypes.STRING
    },
    accessStatus: {
        type: DataTypes.BOOLEAN
    },
    isApprovedByAdmin: {
        type: DataTypes.BOOLEAN
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export const OrgDetails = sequelize.define('sellerDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    providerId: {
        type: DataTypes.STRING,
        unique: true
    },
    providerName: {
        type: DataTypes.STRING,
        unique: true
    },
    registeredAdd: {
        type: DataTypes.STRING
    },
    storeEmail: {
        type: DataTypes.STRING,
        unique: true
    },
    mobileNo: {
        type: DataTypes.STRING,
        unique: true
    },
    PANNo: {
        type: DataTypes.STRING,
        unique: true
    },
    GSTIN: {
        type: DataTypes.STRING,
        unique: true
    },
    FSSAINo: {
        type: DataTypes.STRING,
        unique: true
    },
    addressURL: {
        type: DataTypes.STRING
    },
    idProofURL: {
        type: DataTypes.STRING
    },
    panURL: {
        type: DataTypes.STRING
    },
    gstURL: {
        type: DataTypes.STRING
    },
    category: {
        type: DataTypes.JSON
    },
    logoURL: {
        type: DataTypes.STRING
    },
    location: {
        type: DataTypes.JSON
    },
    locationAvailabilityPANIndia: {
        type: DataTypes.BOOLEAN
    },
    defaultCancellable: {
        type: DataTypes.BOOLEAN
    },
    defaultReturnable: {
        type: DataTypes.BOOLEAN
    },
    fulfillments: {
        type: DataTypes.JSON
    },
    building: {
        type: DataTypes.STRING
    },
    city: {
        type: DataTypes.STRING
    },
    state: {
        type: DataTypes.STRING
    },
    country: {
        type: DataTypes.STRING
    },
    code: {
        type: DataTypes.STRING
    },
    locality: {
        type: DataTypes.STRING
    },
    supportDetails: {
        type: DataTypes.JSON
    },
    storeTimingsStatus: {
        type: DataTypes.STRING
    },
    storeTimingHolidays: {
        type: DataTypes.JSON
    },
    storeTimingEnabled: {
        type: DataTypes.JSON
    },
    radius: {
        type: DataTypes.JSON
    },
    logisticsBppId: {
        type: DataTypes.STRING
    },
    logisticsDeliveryType: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export const bankInfo = sequelize.define('bankDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    providerId: {
        type: DataTypes.STRING,
        unique: true
    },
    accHolderName: {
        type: DataTypes.STRING
    },
    accNo: {
        type: DataTypes.STRING
    },
    bankName: {
        type: DataTypes.STRING
    },
    branchName: {
        type: DataTypes.STRING
    },
    ifscCode: {
        type: DataTypes.STRING
    },
    cancelledChequeUrl: {
        type: DataTypes.STRING
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export const staffDetails = sequelize.define('staffDetails', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    orgId: {
        type: DataTypes.STRING,
    },
    staffId: {
        type: DataTypes.STRING,
        unique: true
    },
    name: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    password: {
        type: DataTypes.STRING
    },
    inventory: {
        type: DataTypes.JSON
    },
    orders: {
        type: DataTypes.JSON
    },
    complaints: {
        type: DataTypes.JSON
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

export const tokenBlocker = sequelize.define("tokenBlocker", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    loginId: {
        type: DataTypes.STRING
    },
    token: {
        type: DataTypes.STRING(512)
    }
}, {
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

    userDetails.sync(),
    OrgDetails.sync(),
    bankInfo.sync(),
    staffDetails.sync()
    tokenBlocker.sync()