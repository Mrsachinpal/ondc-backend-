import mongoose from'mongoose';
import { uuid } from 'uuidv4';
const productCategorySchema = new mongoose.Schema({
    _id:{
        type: String, 
        required:true,
        default: () => uuid(),
    },
    category:{
        type:String,
    },
    status:{
        type:Boolean,
    }
},{  
    strict: true,
    timestamps:true
});



const productCategory = mongoose.model('ProductCategory',productCategorySchema);
export default productCategory;
