// models/Product.js
const mongoose = require('mongoose');

const BarcodeSchema = new mongoose.Schema({
  code: { type: String, required: true }
});

const ContainerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  barcodes: [BarcodeSchema]
});

const ProductSchema = new mongoose.Schema({
  itemNumber:{ type: Number, required: true },
  mainBarcode :{ type: String, required: true },
  itemName: { type: String, required: true },
  printedName: { type: String, required: true }, 
  mainContainer: { type: String, required: true },
  currentCostPrice: { type: String, required: true },
  initialPrice: { type: String },
  currentStock: { type: Number, required: true },
  currency: { type: String, required: true },
  tax: { type: String },
  taxExempt: { type: Boolean, required: true },
  containers: [ContainerSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } 
});


const ProductModel = mongoose.model('Product',ProductSchema);

module.exports={ProductModel};
