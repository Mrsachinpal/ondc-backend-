import Joi from 'joi';

export const productValidateSchema = {
    create: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productId: Joi.string(),
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                timing: Joi.array(),
                fulfillmentId: Joi.string().allow(''),
                fulfillmentOption: Joi.string().allow(''),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                maxAllowedQty: Joi.number(),
                countryOfOrigin: Joi.string(),
                packQty: Joi.number(),
                UOM: Joi.string(),
                UOMValue: Joi.string().allow(' '),
                length: Joi.any(),
                breadth: Joi.any(),
                height: Joi.any(),
                weight: Joi.any(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufactureName: Joi.string(),
                manufactureDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(' '),
                additiveInfo: Joi.string().allow(' '),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCOD: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufactureOrPackerName: Joi.string().allow(' '),
                manufactureOrPackerAddress: Joi.string().allow(' '),
                commonOrGenericNameOfCommodity: Joi.string().allow(' '),
                monthYearOfManufacturePackingImport: Joi.string().allow(' '),
                importFSSAILicenseNo: Joi.string().allow(' '),
                brandOwnerFSSAILicenseNo: Joi.string().allow(' '),
                varientAttributes: Joi.object().allow(' '),
                quantity: Joi.number(),
                MRP: Joi.number(),
                purchasePrice: Joi.number(),
                barcode: Joi.number(),
                images: Joi.array(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(' '),
            }),
            commonAttributesValues: Joi.object({}),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array(),
                customizations: Joi.array()
            })
        });
    },

    createWithVariant: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productId: Joi.string(),
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(' '),
                timing: Joi.array(),
                fulfillmentOption: Joi.string().allow(' '),
                fulfillmentId: Joi.string().allow(' '),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubCategory1: Joi.string(),
                productSubCategory2: Joi.string(),
                productSubCategory3: Joi.string(),
                countryOfOrigin: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.number(),
                UOM: Joi.string(),
                UOMValue: Joi.string().allow(' '),
                length: Joi.string(),
                breadth: Joi.string(),
                height: Joi.string(),
                weight: Joi.string(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufactureName: Joi.string(),
                manufactureDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(' '),
                additiveInfo: Joi.string().allow(' '),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCOD: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufactureOrPackerName: Joi.string().allow(' '),
                manufactureOrPackerAddress: Joi.string().allow(' '),
                commonOrGenericNameOfCommodity: Joi.string().allow(' '),
                monthYearOfManufacturePackingImport: Joi.string().allow(' '),
                importFSSAILicenseNo: Joi.string().allow(' '),
                brandOwnerFSSAILicenseNo: Joi.string().allow(' '),
            }),
            commonAttributesValues: Joi.object(),
            variantSpecificDetails: Joi.array().items(
                Joi.object({
                    varientAttributes: Joi.object(),
                    UOMValue: Joi.string(),
                    quantity: Joi.number(),
                    MRP: Joi.number(),
                    purchasePrice: Joi.number(),
                    barcode: Joi.number(),
                    images: Joi.array(),
                    backImage: Joi.string()
                })
            ),
            variationOn: Joi.string(),
            variantType: Joi.array().items(
                Joi.string()
            ),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array(),
                customizations: Joi.array()
            }),
        });
    },

    update: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(' '),
                timing: Joi.array(),
                fulfillmentOption: Joi.string().allow(' '),
                fulfillmentId: Joi.string().allow(' '),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubcategory1: Joi.string(),
                productSubcategory2: Joi.string(),
                productSubcategory3: Joi.string(),
                countryOfOrigin: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.number(),
                UOM: Joi.string(),
                UOMValue: Joi.string().allow(' '),
                length: Joi.string(),
                breadth: Joi.string(),
                height: Joi.string(),
                weight: Joi.string(),
                isReturnable: Joi.boolean(),
                returnWindow: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufactureName: Joi.string(),
                manufactureDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(' '),
                additiveInfo: Joi.string().allow(' '),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCOD: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufactureOrPackerName: Joi.string().allow(' '),
                manufactureOrPackerAddress: Joi.string().allow(' '),
                commonOrGenericNameOfCommodity: Joi.string().allow(' '),
                monthYearOfManufacturePackingImport: Joi.string().allow(' '),
                importFSSAILicenseNo: Joi.string().allow(' '),
                brandOwnerFSSAILicenseNo: Joi.string().allow(' '),
            }),
            commonAttributesValues: Joi.object(),
            customizationDetails: Joi.object({
                customizationGroups: Joi.array(),
                customizations: Joi.array()
            }),
        });
    },

    updateWithVariant: () => {
        return Joi.object({
            commonDetails: Joi.object({
                productCode: Joi.string(),
                productName: Joi.string(),
                HSNCode: Joi.string(),
                vegNonVeg: Joi.string().valid('VEG', 'NONVEG', 'EGG').allow(' '),
                timing: Joi.array(),
                fulfillmentOption: Joi.string().allow(' '),
                fulfillmentId: Joi.string().allow(' '),
                GST_Percentage: Joi.number(),
                productCategory: Joi.string(),
                productSubCategory1: Joi.string(),
                productSubCategory2: Joi.string(),
                productSubCategory3: Joi.string(),
                countryOfOrigin: Joi.string(),
                maxAllowedQty: Joi.number(),
                packQty: Joi.number(),
                UOM: Joi.string(),
                UOMValue: Joi.string().allow(' '),
                length: Joi.string(),
                breadth: Joi.string(),
                height: Joi.string(),
                weight: Joi.string(),
                isReturndable: Joi.boolean(),
                returnWindw: Joi.string(),
                isVegetarian: Joi.boolean(),
                manufactureName: Joi.string(),
                manufactureDate: Joi.string(),
                nutritionalInfo: Joi.string().allow(' '),
                additiveInfo: Joi.string().allow(' '),
                instructions: Joi.string(),
                isCancellable: Joi.boolean(),
                availableOnCOD: Joi.boolean(),
                longDescription: Joi.string(),
                description: Joi.string(),
                manufactureOrPackerName: Joi.string().allow(' '),
                manufactureOrPackerAddress: Joi.string().allow(' '),
                commonOrGenericNameOfCommodity: Joi.string().allow(' '),
                monthYearOfManufacturePackingImport: Joi.string().allow(' '),
                importFSSAILicenseNo: Joi.string().allow(' '),
                brandOwnerFSSAILicenseNo: Joi.string().allow(' '),
            }),
            commonAttributesValues: Joi.object(),
            variantSpecificDetails: Joi.array().items(
                Joi.object({
                    varientAttributes: Joi.object(),
                    UOMValue: Joi.string(),
                    quantity: Joi.number(),
                    MRP: Joi.number(),
                    purchasePrice: Joi.number(),
                    barcode: Joi.number(),
                    images: Joi.array()
                })
            ),
        });
    },

    createCustomization: () => {
        return Joi.object({
            customizationDetails: Joi.object({
                customizationGroups: Joi.array(),
                customizations: Joi.array()
            })
        })
    },

    publish: () => {
        return Joi.object({
            published: Joi.boolean().required(),
        });
    },

    get: () => {
        return Joi.object({
            productId: Joi.string.guid({
                version: ['uuidv4']
            })
        })
    },

    list: () => {
        return Joi.object({
            name: Joi.string().empty(''),
            offset: Joi.number(),
            limit: Joi.number()
        })
    }
}
