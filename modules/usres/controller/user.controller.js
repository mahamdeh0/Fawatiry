var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { userModel } = require('../../../DB/model/user.model');
const { ProductModel } = require('../../../DB/model/Product.model');

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

module.exports = { signin, signup,addProduct };
