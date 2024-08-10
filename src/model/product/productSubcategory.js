import mongoose from'mongoose';
import productCategory from './productCategory';
import { uuid } from 'uuidv4';
const productSubCategorySchema = new mongoose.Schema({
    _id:{
        type: String, 
        required:true,
        default: () => uuid(),
    },
    productSubCategory:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'productCategory',
    },
    status:{
        type:Boolean,
    }
},{  
    strict: true,
    timestamps:true
});



const productSubCategory = mongoose.model('ProductSubCategory',productSubCategorySchema);
export default productSubCategory;
