var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { userModel } = require('../../../DB/model/user.model');
const { ProductModel } = require('../../../DB/model/Product.model');

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
  }

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
            const {products} = req.body;
            const normalizedProducts = products.map(normalizeProductData)
            await ProductModel.insertMany(normalizedProducts);
            res.status(200).json(normalizedProducts)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };
  const extractContainers = async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    // Read the Excel file from buffer
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
  
    // Convert the sheet to JSON
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
    // Assuming the first row contains the headers
    const headers = jsonData[0];
  
    // Finding the indices of the container names in the headers
    const containerHeaders = headers.filter(header => header.startsWith('عدد الوحدات'));
  
    // Extract container names from the headers
    const containerNames = containerHeaders.map(header => header.replace('عدد الوحدات ', ''));
  
    res.json({ containerNames });
  };
 
module.exports = {extractContainers,addProductsArray, signin, signup,addProduct };
