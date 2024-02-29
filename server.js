import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import connectDB from './config/db.js';
import authRoute from './routes/authRoute.js'
import categoryRoute from './routes/categoryRoutes.js'
import productRoute from './routes/productRoutes.js'
import cors from 'cors'

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/v1/auth',authRoute);
app.use('/api/v1/category',categoryRoute);
app.use('/api/v1/product',productRoute);

app.listen(process.env.PORT || 8080,()=>{
    console.log("runnnig port");
})