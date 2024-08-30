import ProductService from '../service/productService.js';
import { templateKeys, commonKeys } from '../../../utils/constants.js';
import { mergedAttributeValidation } from '../validationSchema/bulkUploadAttributeValidation.js';
import { mergedValidation } from '../validationSchema/bulkUploadValidation.js';
import jwt from 'jsonwebtoken'
import { config } from '../../../config/index.js';
const { secret_key } = config

class ProductController {
    async create(req, res) {
        try {
            const data = req.body;
            console.log("Getting data from fromtend", data);

            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const product = await ProductService.create(data, seller);
            return res.send({
                success:true,
                product
            });
        } catch (error) {
            res.status(400).json({
                message: "Error in ProductController",
                error: error
            });
        }
    }

    async createWithVariants(req, res) {
        try {
            const data = req.body;
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const product = await ProductService.createWithVariants(data, seller);
            return res.send(product)
        } catch (error) {
            res.status(400).json({
                error: error
            })
        }
    }

    async update(req, res) {
        try {
            console.log('updateapi hit hui initially');
            const params = req.params
            console.log('object id ', params);
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const product = await ProductService.update(params.productId, req.body, seller);
            console.log('product service se kaam ho gaya mera');
            return res.send(product);
        } catch (error) {
            // console.log("Error", error);
            res.status(400).json({
                message: "Error in Update",
                error: error
            });
        }
    }

    async updateWithVariants(req, res) {
        try {
            const { authorization: token } = req.headers
            const seller = jwt.verify(token, secret_key);
            const product = await ProductService.updateWithVariants(req.body, req.user, seller);
            return res.send(product);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async uploadCatalogue(req, res) {
        try {
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const { category } = req.query;
            if (!category) {
                return res.status(400).send('Category Parameter is missing');
            }
            let path = req.file.path;
            var workbook = XLSX.readFile(path, {
                type: 'binary',
                cellDates: true,
                cellNF: false,
                cellText: false
            });
            var sheet_name_list = workbook.SheetNames;
            let jsonData = XLSX.utils.sheet_to_json(
                workbook.Sheets[sheet_name_list]
            );

            if (jsonData.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "xsls sheet has no data",
                    error: "xsls sheet has no data"
                });
            } else {
                const allTemplateKeys = Object.values(templateKeys).flat();
                const validKeys = [...allTemplateKeys];
                let inputKeys = Object.keys(jsonData[0]);

                if (validKeys.length !== inputKeys.length && inputKeys.every(e => !validKeys.includes(e))) {
                    return res.status(400).json({
                        success: false,
                        message: 'Template is invalid',
                        error: 'Template is invalid'
                    });
                }

                const mergedSchema = mergedValidation(category.toLowerCase().replace(/\s+/g, ''));
                const commonSchema = mergedAttributeValidation(category.toLowerCase().replace(/\s+/g, ''));
                for (let row of jsonData) {
                    if (row.isReturnable?.toLowerCase() === 'yes') {
                        row.isReturnable = true;
                    } else {
                        row.isReturnable = false;
                    }

                    if (row.isVegetarian?.toLowerCase() === 'yes') {
                        row.isVegetarian = true;
                    } else {
                        row.isVegetarian = false;
                    }

                    if (row.availableOnCod?.toLowerCase() === 'yes') {
                        row.availableOnCod = true;
                    } else {
                        row.availableOnCod = false
                    }

                    if (row.isCancellable?.toLowerCase() === 'yes') {
                        row.isCancellable = true;
                    } else {
                        row.isCancellable = false;
                    }

                    let protocolKey = null;
                    if (category === 'Food and Beverages') {
                        protocolKey = '@ondc/org/mandatory_reqs_veggies_fruits'
                    } else if (category === 'Fashion') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    } else if (category === 'Electronics') {
                        protocolKey = ''
                    } else if (category === 'Grocery') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    } else if (category === 'Home and Kitchen') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    } else if (category === 'Health and Wellness') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    } else if (category === 'Beauty and Personal Care') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    } else if (category === 'Appliances') {
                        protocolKey = '@ondc/org/statutory_reqs_packaged_commodities'
                    }

                    row.productSubCategory1 = JSON.stringify({
                        value: (row.productSubcategory1).toLowerCase().replace(/\s+/g, ''),
                        key: row.productSubcategory1,
                        protocolKey: protocolKey
                    });
                    row.productSubCategory = category;
                    const commonKeys = Object.keys(row).filter(key => category.toLowerCase().replace(/\s+/g, ''));
                    const commonRow = {}
                    commonKeys.forEach(key => {
                        commonRow[key] = row[key]; row
                        delete row[key];
                    });

                    const { error: commonValidationError, value: validatedCommonRow } = commonSchema.validate(commonRow, {
                        allowUnknown: true
                    });

                    const { error: validationError, value: validatedRow } = mergedSchema.validate(row, {
                        allowUnknown: true
                    });

                    if (validatedCommonRow) {
                        Object.assign(row, validatedCommonRow);
                        validatedRow.organization = seller.providerId;
                        try {
                            let data = {
                                commonDetails: { ...validatedRow, ...validatedCommonRow },
                                // commonAttributesValues: validatedCommonRow
                            }
                            await productService.create(data, seller) ///currentSeller
                        } catch (error) {
                            res.status(400).json({
                                error: error
                            })
                        }

                    } else {
                        let errors = [];
                        if (commonValidationError) {
                            errors = errors.concat(commonValidationError.details.map(err => err.message));
                        }

                        if (validationError) {
                            errors = errors.concat(validationError.details.map(err => err.message))
                        }

                        return res.status(400).json({
                            message: 'Row Validation failed',
                            error: errors
                        });
                    }
                }
            }
            return res.send({ success: true });
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async list(req, res) {
        try {
            const query = req.query;
            query.offset = parseInt(query.offset ?? 0);
            query.limit = parseInt(query.limit ?? 100);
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const products = await ProductService.list(query, seller);
            return res.send(products);
        } catch (error) {
            res.status(400).json({
                message: "Error, didn't shown list",
                error: error

            });
        }
    }

    async search(req, res) {
        try {
            let query = req.query;
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key)
            query.offset = 0;
            query.limit = 50;
            const products = await ProductService.search(query, seller);
            return res.send(products);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async productStatus(req, res) {
        try {
            const { productId, action } = req.body;
            const updatedAction = await ProductModel.update(
                { published: action },
                {
                    where: { productId }
                });
            res.status(200).json({
                message: "Status Updated Successfully",
                data: updatedAction
            });
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async uploadTemplate(req, res) {
        try {
            const { category } = req.query;
            if (!category) {
                return res.status(400).json({
                    message: "Category parameter is missing",
                    error: "Category parameter is missing"
                });
            }
            const file = `${category.toLowerCase().replace(/\s+/g, '_')}.xlsx`
            const FILE_PATH = path.join(__dirname, file);
            fs.access(FILE_PATH, fs.constants.F_OK, (err) => {
                if (err) {
                    return res.status(400).json({
                        message: "Template not found for the specified category",
                        error: "Template not found for the specified category"
                    });
                }
                const fileName = path.basename(FILE_PATH);
                res.download(FILE_PATH, fileName);
            });
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }

    async storeCustomization(req, res, next) {
        try {
            const { authorization: token } = req.headers;
            const seller = jwt.verify(token, secret_key);
            const params = req.params;
            const data = req.body;
            const categoryVariant = await ProductCustomizationService.create(params.productId, data.customizationDetails, seller);
            return send(categoryVariant);
        } catch (error) {
            res.status(400).json({
                error: error
            });
        }
    }
}

export default new ProductController();