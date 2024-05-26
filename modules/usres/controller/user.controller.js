var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { userModel } = require('../../../DB/model/user.model');
const { ProductModel } = require('../../../DB/model/Product.model');
const xlsx = require('xlsx');
const fs = require('fs');
const { containerModel } = require('../../../DB/model/Containers.model');
const { categoryModel } = require('../../../DB/model/Category.model');
function normalizeProductData(product) {
    return {
        itemNumber:product.itemNumber || '999999',
      itemName: product.itemName || 'x',
      printedName: product.printedName || ' ',
      mainBarcode: product.barcode || 'x',
      mainContainer: Object.keys(product.containers)[0]|| 'x',
      currentCostPrice: product.cost || 0,
      initialPrice:  0,
      currentStock: product.currentBalance || 0,
      currency: 'NIS',
      tax:  0,
      taxExempt:  false,
      containers: Object.entries(product.containers).map(([key, value]) => ({
        name: key ||'x',
        price: value.sellPrice || 0,
        quantity:  0,
        barcodes: (value.barcodes || []).map(code => ({ code }))
      })),
      user:"664de2a412cca3cc00885da6"
    };
};

const signup = async (req, res) => {
    const { userName, email, password} = req.body;

    try {
        const user = await userModel.findOne({ email });
        if (user) {
            return res.json({ message: "Email already registered" });
        } else {
            const hashpassword = await bcrypt.hash(password, parseInt(process.env.saltRound));
            const newUser = new userModel({ userName, email, password: hashpassword });
            const savedUser = await newUser.save();
            res.json({ message: "User registered successfully", savedUser });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    console.log(email)
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Email not found" });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, process.env.TokenSignature);
        res.status(200).json({ message: "Logged in successfully", token,username:user.userName});
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    try {
      const productData = req.body;
      productData.user = req.user._id;  
      const product = new ProductModel(productData);
      await product.save();
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
};

const addProductsArray = async (req, res) => {
    try {
        const { products } = req.body;

        for (const product of products) {
            const { itemName, containers } = product;

            for (const container of containers) {
                const { containerType, barcodes } = container;
                console.log("here")
                await ProductModel.updateOne(
                    { itemName, 'containers.name': containerType },
                    {
                        $addToSet: { 'containers.$.barcodes': { $each: barcodes.map(code => ({ code })) } }
                    }
                );
            }
        }

        res.json({ msg: "Products updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

  
async function initDataBaseFromHisabatiXlsx(req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = jsonData[0];
  
    const containerHeaders = headers.filter(header => header.startsWith('عدد الوحدات'));
    const containerNames = containerHeaders.map(header => header.replace('عدد الوحدات ', ''));
    const newContainers = new containerModel({ containers: containerNames, user: req.user });
   const savedContainers = await newContainers.save();


    const categoryIndex = headers.indexOf('التصنيف');
    if (categoryIndex === -1) {
        return res.status(400).send('التصنيف header not found.');
    }

    const categories = [];
    for (let i = 2; i < jsonData.length; i++) { // Skip first 2 rows
        const row = jsonData[i];
        const category = row[categoryIndex];
        if (category && category !== 'بلا') {
            categories.push(category);
        }
    }

    const uniqueCategories = [...new Set(categories)];
    const existingCategories = await categoryModel.find({ categorys: { $in: uniqueCategories }, user: req.user });
    const existingCategorySet = new Set(existingCategories.map(cat => cat.categorys).flat());

    const newCategories = uniqueCategories.filter(category => !existingCategorySet.has(category));
    const containerQuantityHeaders = headers.filter(header => header.includes('عدد الوحدات '));
    const containerPriceHeaders = headers.filter(header => header.includes('السعر '));
   // const containerBarcodeHeaders = headers.filter((header,index) => header.includes(`${containerNames[index]}`+'باركود '));
        const products=[];
   jsonData.slice(2).forEach((row, rowIndex) => {
            if(row.length == 0)
                {
                    return;
                }
        const containers = containerQuantityHeaders.map((header, index) => {
            const quantityIndex = headers.indexOf(header);
            const priceIndex = headers.indexOf(containerPriceHeaders[index]);
          //  const barcodeIndex = headers.indexOf(containerBarcodeHeaders[index]);
    
            const quantity = row[quantityIndex];
            const price = row[priceIndex];
           // const barcodes = row[barcodeIndex] ? row[barcodeIndex].map(code => ({ code: code.trim() })) : [];
    
            if (quantity > 0) {
                return {
                    name: header.replace('عدد الوحدات ', ''),
                    price: price || 0,
                    quantity: quantity,
                    barcodes: []
                };
            }
            return null;
        }).filter((container) => container !== null);
        
        products.push({
            itemNumber:rowIndex,
            printedName:" ",
            currency:"NIS",
            taxExempt:false,
            itemName: row[headers.indexOf('الاسم')],
            currentCostPrice: row[headers.indexOf('التكلفة')],
            currentStock: row[headers.indexOf('الرصيد الحالي')],
            category: row[headers.indexOf('التصنيف')] === "بلا" ? "" : row[headers.indexOf('التصنيف')],
            mainBarcode: String(row[headers.indexOf('باركود')]),
            tax: row[headers.indexOf('الضريبة')],
            initialStock: row[headers.indexOf('كميات المخزون الابتدائية')],
            containers: containers,
            user:req.user
        });
    })
    const savedProducts = await ProductModel.insertMany(products);
       
   // Save the new categories
    if (newCategories.length > 0) {
        const newCategoryModel = new categoryModel({ categorys: newCategories, user: req.user });
        const savedCategories = await newCategoryModel.save();
        return res.json({ savedContainers, savedCategories,savedProducts });
    } else {
        return res.json({ savedContainers, message: 'No new categories to add.' });
    }
};

  
module.exports = { initDataBaseFromHisabatiXlsx,addProductsArray, signin, signup,addProduct };
