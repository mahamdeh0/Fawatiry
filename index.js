require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./DB/connection');
const bodyParser = require('body-parser')
const app = express();
const port = process.env.PORT || 3000;
const indexRouter = require('./modules/index.router');
connectDB();
app.use(bodyParser.json({ limit: '200mb' }));
app.use(bodyParser.urlencoded({ limit: '200mb', extended: true }));
app.use(cors());
app.use(express.json());
app.use('/api/v1/users', indexRouter.userRouter);
app.use('*', (req, res) => {
    res.status(404).json({ message: "page not found" });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
