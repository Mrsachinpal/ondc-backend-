import productCustomizationService from './productCustomizationService.js';
import { variantGroup } from '../../../model/product/variantGroup.js';
const VariantGroup = new variantGroup();
import { OrgDetails } from '../../../model/admin/index.js';
import { ProductAttribute } from '../../../model/product/product_attribute.js';
import { v4 as uuidv4 } from "uuid";
import ProductModel from "../models/product.model.js";
import { DuplicateRecordFoundError } from "../../lib/errors/index.js"


class ProductService {  
    async create(data, currentSeller) {
        try {
            const { orgId, staffID, providerId } = currentSeller;
            const productExist = await ProductModel.findOne({ productName: commonDetails.data.productName, organization: providerId ?? orgId });
            if (productExist) {
                throw new DuplicateRecordFoundError(MESSAGES.PRODUCT_ALREADY_EXISTS)
            }
            let product = new ProductModel(data.commonDetails);
            product.createdBy = providerId ?? staffID;
            product.updatedBy = providerId ?? staffID;
            product.organization = providerId ?? orgId;
            await product.save();
            if (data.commonAttributesValues) {
                await this.createAttribute({ product: product._id, attributes: data?.commonAttributesValues }, currentSeller);
            }
            if (data.customizationDetails) {
                await productCustomizationService.create(product._id, data?.customizationDetails, currentSeller);
            }
            return { data: product };
        } catch (error) {
            res.status(400).json({
                message: "Error in Product Service",
                error: error
            })
        }
    }

    async createWithVariants(data, currentSeller) {
        try {
            const commonDetails = data.commonDetails;
            const commonAttributeValues = data.commonAttributeValues;
            const customizationDetails = data.customizationDetails;
            const variantSpecificDetails = data.variantSpecificDetails;
            const { orgId, staffID, providerId } = currentSeller;
            let variantGroup = {};
            let variantType = [];
            let i = 0;
            for (const variant of variantSpecificDetails) {
                const variantAttributes = variant.variantAttributes
                delete variant.variantAttributes
                if (i === 0) {
                    for (const attribute in variantAttributes) {
                        variantType.push(attribute)
                    }
                    variantGroup = new VariantGroup();
                    variantGroup.organization = providerId ?? orgId;
                    variantGroup.name = variantType;
                    variantGroup.variationOn = data.variationOn;
                    await variantGroup.save();
                }
                i++;
                let productObj = {};
                productObj = { ...commonDetails, ...variant };
                productObj.variantGroup = variantGroup.id;
                productObj.productId = uuidv4();
                productObj.organization = providerId ?? orgId;
                productObj.createdBy = providerId ?? staffID;
                productObj.updatedBy = providerId ?? staffID;
                let product = new ProductModel(productObj);
                await product.save();

                let attributeObj = {
                    ...commonAttributeValues, ...variantAttributes
                };

                if (customizationDetails) {
                    await productCustomizationService.create(productObj.productId, data.customizationDetails, currentSeller)
                }
                await this.createAttribute({ productId: productObj.productId, attributes: attributeObj }, currentSeller);
            }
            return { success: true }
        } catch (error) {
            console.log("Error", error);
        }
    }

    async updateWithVariants(data, currentSeller) {
        try {
            const commonDetails = data.commonDetails;
            const commonAttributeValues = data.commonAttributeValues;
            const variantSpecificDetails = data.variantSpecificDetails;
            const { staffID, providerId, orgId } = currentSeller
            for (const productVariant of variantSpecificDetails) {
                let variantProduct = await ProductModel.findOne({ productId: productVariant.id, organization: orgId ?? providerId }).lean();
                if (variantProduct) {
                    let productObj = { ...variantProduct, ...commonDetails }
                    productObj.quantity = productVariant.quantity
                    productObj.organization = currentSeller.organization
                    productObj.MRP = productVariant.MRP
                    productObj.purchasePrice = productVariant.purchasePrice
                    productObj.HSNCode = productVariant.HSNCode
                    productObj.images = productVariant.images
                    await ProductModel.updateOne({ productId: productVariant.id, organization: orgId ?? providerId }, productObj);
                    let variantAttributes = productVariant.variantAttributes
                    let attributeObj = {
                        ...commonAttributeValues, ...variantAttributes
                    }
                    if (attributeObj) {
                        await this.createAttribute({ productId: productVariant.id, attributes: attributeObj }, currentSeller)
                    }
                }
            }
            return { success: true }
        } catch (error) {
            console.log("Error", error);
        }
    }

    async createAttribute(data, currentSeller) {
        try {
            const attributes = data.attributes;
            const { orgId, providerId } = currentSeller
            for (const attribute in attributes) {
                if (attribute.hasOwnProperty(attribute)) {
                    let attributeExist = await ProductAttribute.findOne({ product: data.product, code: attribute, organization: orgId ?? providerId });
                    if (attributeExist) {
                        await ProductAttribute.updateOne({ product: data.product, code: attribute, organization: orgId ?? providerId }, { value: attributes[attribute] });
                    } else {
                        let productAttribute = new ProductAttribute();
                        productAttribute.product = data.product
                        productAttribute.code = attribute
                        productAttribute.value = attributes[attribute]
                        productAttribute.organization = orgId ?? providerId
                        await productAttribute.save()
                    }
                }
            }
            return ({ success: true })
        } catch (error) {
            console.log("Error", error);
        }
    }

    // async update(productId, data, currentSeller) {
    //     try {
    //         console.log('product serice file pr aa gaya hu');
    //         const commonDetails = data.commonDetails
    //         const commonAttributeValues = data.commonAttributeValues
    //         const { staffID, orgId, providerId } = currentSeller
    //         console.log('bhai data.commonDeatils ka data',commonDetails);
    //         const product = await ProductModel.findOne({ where: { productId: productId, organization: orgId ?? providerId }, raw: true });
    //         let productObj = { ...product, ...commonDetails }
    //         await ProductModel.update(productObj, { where: { productId: productId } });
    //         if (commonAttributeValues) {
    //             await this.createAttribute({ productId: productId, attribute: commonAttributeValues }, currentSeller)
    //         }
    //         if (data.customizationDetails) {
    //             await productCustomizationService.create(productId, data.customizationDetails, currentSeller);
    //         }
    //         return { data: productObj };
    //     } catch (error) {
    //         console.log("error hai babu bhaiya");
    //         console.log("Error", error);
    //     }
    // }

    async update(productId, data, currentSeller) {
        try {
            const commonDetails = data.commonDetails;
            const commonAttributeValues = data.commonAttributeValues;
            const { staffID, orgId, providerId } = currentSeller;
            const product = await ProductModel.findOne({ _id: productId, organization: orgId ?? providerId });
            const updatedProduct = await ProductModel.findByIdAndUpdate(productId, { $set: commonDetails }, { new: true });
            if (commonAttributeValues) {
                await this.createAttribute({ productId: productId, attribute: commonAttributeValues }, currentSeller)
            }
            if (data.customizationDetails) {
                await productCustomizationService.create(productId, data.customizationDetails, currentSeller);
            }
            return { message: "Suucessfully updated", data: updatedProduct };
        } catch (error) {
            console.log("Error", error);
        }
    }

    // async list(params, seller) {
    //     try {

    //         const { orgId, providerId } = seller
    //         let query = {
    //             organization: providerId ?? orgId
    //         };

    //         if (params.name) {
    //             query.productName = { $regex: params.name, $options: 'i' };
    //         }
    //         if (params.category) {
    //             query.productCategory = params.category;
    //         }
    //         if (params.stock && params.stock === 'inStock') {
    //             query.quantity = { $gt: 0 }
    //         } else if (params.stock && params.stock === 'outofStock') {
    //             query.quantity = { $lte: 0 }
    //         }
    //         const data = await ProductModel.findAll({ where: query })  ///.sort({ createdAt: -1 }).skip(params.offset * params.limit).limit(params.limit);
    //         const count = await ProductModel.count(query);
    //         let products = {
    //             count,
    //             data
    //         }
    //         return products;
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    async list(params, seller) {
        try {
            const { orgId, providerId } = seller;
            const products = await ProductModel.find({
                $or: [
                    { organization: orgId ?? providerId },
                    { createdBy: providerId ?? orgId }
                ]
            })
            return products;
        } catch (error) {
            console.log("Error", error);
        }
    }

    // async search(params, seller) {
    //     try {
    //         let query = {};
    //         const { orgId, providerId } = seller
    //         const name = params.name
    //         const category = params.category
    //         // const orgs = await OrgDetails.find({})   ///.lean();
    //         const orgs=await OrgDetails.findAll();
    //         let products = [];
    //         for (const org of orgs) {
    //             query.organization = orgId ?? providerId;
    //             query.published = true;
    //             if (params.name) {
    //                 query.productName = name;
    //             }
    //             if (params.category) {
    //                 query.productCategory = category;
    //             }
    //             console.log(`query: ${query}`); 
    //             const data = await ProductModel.findOne({ where: query });
    //             console.log(data)
    //             //const data = await ProductModel.findAll({ where: query, raw: true })  ///.sort({ createdAt: 1 }).skip(params.offset).limit(params.limit);
    //             if (data.length > 0) {
    //                 for (const product of data) {
    //                     // let productDetails = product;
    //                     // let images = [];
    //                     // for (const image of productDetails.images) {
    //                     //     let imageData = await s3.getSignedUrlForRead({ path: image });
    //                     //     image.push(imageData.url);
    //                     // }
    //                     // product.images = images;
    //                 }
    //                 org.items = data;
    //                 products.push(org);
    //             }
    //         }
    //         return products;
    //     } catch (error) {
    //         console.log("Error", error);
    //     }
    // }

    async search(params, seller) {
        try {
            const { orgId, providerId } = seller;
            const { name, stock } = params;

            let query = {
                $or: [
                    { organization: orgId },
                    { createdBy: providerId }
                ]
            };

            if (stock === "inStock") {
                query.quantity = { $gt: 0 };
            } else if (stock === "outOfStock") {    
                query.quantity = { $lte: 0 };
            } 
            // console.log("query", query);
            let products = await ProductModel.find(query).exec();
            console.log("products", products);

            if (name) {
                const regex = new RegExp(name, 'i');
                products = products.filter(product =>
                    regex.test(product.productName)
                );
            }

            return products;
        } catch (error) {
            console.log("Error", error);
        }
    }


}

export default new ProductService();