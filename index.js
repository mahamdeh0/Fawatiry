require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./DB/connection');

const app = express();
const port = process.env.PORT || 3000;
const indexRouter = require('./modules/index.router');

// Connect to the database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Multer configuration



app.use('/api/v1/users', indexRouter.userRouter);

app.use('*', (req, res) => {
    res.status(404).json({ message: "page not found" });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
