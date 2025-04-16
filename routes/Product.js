import express from "express";
import { ProductModel } from "../models/Product.js";
import multer from "multer";
import cloudinary from "../utils/cloudinary.js";

const Productrouter = express.Router();

// Configure multer to store files in memory
const upload = multer({ storage: multer.memoryStorage() });


Productrouter.post("/Productadd", upload.single('file'), async (req, res) => {
  console.log("Request file:", req.file); // Log the file data from the request

  const { name, price, description, link, category } = req.body;
  console.log(req.body);

  try {
    // Convert the buffer to a readable stream
    const fileStream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "image",
        folder: "product-images" // Specify the folder name
      },
      (error, result) => {
        if (error) {
          console.error("Error uploading video to Cloudinary:", error);
          return res.status(500).json({ message: "Internal server error" });
        }
        const newProduct = new ProductModel({
          name,
          price,
          description,
          image: result.secure_url,
          link,
          category
        });

        newProduct.save()
          .then(() => {
            // Return success response to the client
            return res.json({
              message: "Product Added Successfully",
              status: true
            });
          })
          .catch((saveError) => {
            console.error("Error saving product to the database:", saveError);
            return res.status(500).json({ message: "Internal server error" });
          });
      }
    );

    // Pipe the buffer to the file stream
    fileStream.write(req.file.buffer);
    fileStream.end();
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});


Productrouter.post("/Productupdate", upload.single('file'), async (req, res) => {
  console.log("Request file:", req.file); // Log the file data from the request

  const { id, name, price, description, link, category } = req.body;

  try {
    const existingProduct = await ProductModel.findOne({ product_id: id });
    
    // Update existing product fields if provided in the request
    if (name){
      existingProduct.name = name;
    } else{
      existingProduct.name = existingProduct.name;
    }
    if (price){
      existingProduct.price = price;
    } else{
      existingProduct.price = existingProduct.price;
    }
    if (description){
      existingProduct.description = description;
    } else{
      existingProduct.description = existingProduct.description;
    }
    if (link){
      existingProduct.link = link;
    } else{
      existingProduct.link = existingProduct.link;
    }
    if (category){
      existingProduct.category = category;
    } else{
      existingProduct.category = existingProduct.category;
    }

    

    // Handle file upload if a file is provided
    if (req.file) {
      const fileStream = cloudinary.v2.uploader.upload_stream(
        {
          resource_type: "image",
          folder: "product-images" // Specify the folder name
        },
        async (error, result) => {
          if (error) {
            console.error("Error uploading image to Cloudinary:", error);
            return res.status(500).json({ message: "Internal server error" });
          }

          existingProduct.image = result.secure_url;

          // Save the updated product to the database
          try {
            await existingProduct.save();
            // Return success response to the client
            return res.json({
              message: "Product Updated Successfully",
              status: true
            });
          } catch (saveError) {
            console.error("Error saving product to the database:", saveError);
            return res.status(500).json({ message: "Internal server error" });
          }
        }
      );

      // Pipe the buffer to the file stream
      fileStream.write(req.file.buffer);
      fileStream.end();
    } else {
      // If no file is provided, save the updated product without modifying the image
      try {
        // Save the existing product without updating the image
        await existingProduct.save();
        // Return success response to the client
        return res.json({
          message: "Product Updated Successfully",
          status: true
        });
      } catch (saveError) {
        console.error("Error saving product to the database:", saveError);
        return res.status(500).json({ message: "Internal server error" });
      }
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

Productrouter.post("/Productdlt", async (req, res) => {
  const { id } = req.body;

  try {
      // Find the product
      const product = await ProductModel.findOne({ product_id: id });

      if (!product) {
          return res.status(404).json({ message: "Product not found" });
      }

      // Delete the product
      await ProductModel.deleteOne({ product_id: id });

      res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Internal server error" });
  }
});




Productrouter.get("/Productget", async (req, res) => {
  try {
    const products = await ProductModel.find();
    return res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export { Productrouter };