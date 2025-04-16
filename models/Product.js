import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";

const ProductSchema = new mongoose.Schema({
    name: { type: String, },
    price: { type: String, },
    description: { type: String, },
    image: { type: String, },
    link : { type: String, },
    category : { type: String, }

    
});


ProductSchema.plugin(mongooseSequence(mongoose), { inc_field: 'product_id' });

const ProductModel = mongoose.model("Product", ProductSchema);

export { ProductModel };
