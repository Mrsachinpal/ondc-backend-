import mongoose from'mongoose';
import { uuid } from 'uuidv4';
const productSchema = new mongoose.Schema({
    _id:{
        type: String, 
        required:true,
        default: () => uuid(),
    },
    productCode: {type:String},
    productName: {type:String,required:true},
    variantGroup : {type:String,ref:'VariantGroup'},
    MRP: {type:Number},
    purchasePrice: {type:Number},
    HSNCode: {type:String},
    vegNonVeg :{type:String},
    fulfillmentOption:{type:String},
    timing : {type:Array},
    fulfillmentId : {type:String},
    countryOfOrigin :{ type : String},
    GST_Percentage: {type:Number},
    productCategory: {type:String},
    productSubcategory1: {type:String},
    productSubcategory2: {type:String}, 
    productSubcategory3: {type: String},    
    quantity: {type:Number},
    barcode: {type:Number},
    maxAllowedQty: {type:Number},
    packQty:{type:String},  
    UOM: {type:String},//units of measure
    UOMValue: {type:String},//units of measure 
    length: {type:String},
    breadth: {type:String},
    height: {type:String},
    weight: {type:String},
    isReturnable: {type:Boolean},
    returnWindow: {type:String},
    isVegetarian: {type:Boolean},
    manufactureName: {type:String},
    manufactureDate: {type:String},
    nutritionalInfo: {type:String},
    additiveInfo: {type:String},
    instructions: {type:String},
    isCancellable: {type:Boolean},
    availableOnCOD: {type:Boolean},
    longDescription: {type:String},
    description: {type:String},
    organization: { type: String, ref: 'Organization' },
    images: {type:Array},
    createdBy:{type:String},
    published:{type:Boolean,default:true},
    manufactureOrPackerName:{type:String},
    manufactureOrPackerAddress:{type:String},
    commonOrGenericNameOfCommodity:{type:String},
    monthYearOfManufacturePackingImport:{type:String},
    importFSSAILicenseNo:{type:String},
    brandOwnerFSSAILicenseNo:{type:String}

},{  
    strict: true,
    timestamps:true
});


productSchema.index({name:1}, {unique: false});
const Product = mongoose.model('Product',productSchema);
export default Product;
