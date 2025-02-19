const express = require('express');
const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoutes');
const cors = require('cors');


const app = express();

app.use(cors());//to allow cross origin requests

app.use(express.json());

require('dotenv').config();

const PORT = process.env.PORT || 5000;

//user routes
app.use('/api/v1/users', userRoute);  //api/v1/users is a base route

//transaction routes
app.use('/api/v1/transactions',transactionRoute);  //api/v1/transactions is a base route

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const connectDB = require('./config/connectDB');
connectDB();