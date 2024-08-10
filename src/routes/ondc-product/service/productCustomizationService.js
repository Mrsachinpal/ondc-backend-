import { ProductModel } from '../../../model/product/productModel.js';
import { productCustomization } from '../../../model/product/productCustomization.js';
import { productCustomizationGroup } from '../../../model/product/productCustomizationGroup.js';

class ProductCustomizationService {
    async create(productId, customizationDetails, currentSeller) {
        try {
            const customizationExist = await productCustomizationGroup.find({ product: productId, organization: currentSeller.organization });
            if (customizationExist) {
                await productCustomizationGroup.deleteMany({ product: productId, organization: currentSeller.organization });
                await productCustomization.deleteMany({ product: productId, organization: currentSeller.organization });
            }
            if (customizationDetails) {
                const customizationGroups = customizationDetails.customizationGroups;
                const customizations = customizationDetails.customizations;
                for (const customizationGroup of customizationGroups) {
                    let customizationGroupObj = {
                        ...customizationGroup,
                        product: productId,
                        organization: currentSeller.organization,
                        updatedBy: currentSeller.id,
                        createdBy: currentSeller.id
                    };
                    let productCustomizationGroup = new productCustomizationGroup(customizationGroupObj);
                    await productCustomizationGroup.save()
                }
                for (const customization of customizations) {
                    let childGroup = await productCustomizationGroup.findOne({ product: productId, organization: currentSeller.organization, id: customization.child });
                    let parentGroup = await productCustomizationGroup.findOne({ product: productId, organization: currentSeller.organization, id: customization.parent });
                    let customizationObj = {
                        ...customization,
                        product: productId,
                        childId: childGroup.id ?? '',
                        parentId: parentGroup.id ?? '',
                        organization: currentSeller.organization,
                        updatedBy: currentSeller.id,
                        createdBy: currentSeller.id
                    }
                    let productCustomizationGroup = new productCustomization(customizationObj);
                    await productCustomizationGroup.save()
                }
                return { success: true };
            }
        } catch (error) {
            console.log("Error in ProductCustomizationService", error);
        }
    }

    async get(productId, currentSeller) {
        try {
            const product = await ProductModel.findOne({ productId: productId, organization: currentSeller.organization });
            if (product) {
                return {
                    customizationGroups: await productCustomizationGroup.findOne({ productId: productId, organization: currentSeller.organization }),
                    customizations: await productCustomization.findOne({ productId: productId, organization: currentSeller.organization })
                }
            } else {
                console.log('Product Not Found');
            }
        } catch (error) {
            console.log("Error in ProductCustomizationService' get", error);
        }
    }

    async getForApi(productId) {
        try {
            const product = await Product.findOne({ productId: productId });
            if (product) {
                return {
                    customizationGroups: await productCustomizationGroup.findOne({ productId: productId }),
                    customizations: await productCustomization.findOne({ productId: productId })
                }
            } else {
                console.log('Product Not Found');
            }
        } catch (error) {
            console.log("Error in ProductCustomizationService' getForApi", error);

        }
    }
}

export default new ProductCustomizationService();