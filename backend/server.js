import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js'
import userRouter from './routes/userRoute.js'

// app config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

// Debug: Log all registered routes
console.log('Registered admin routes:');
adminRouter.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log('  ' + Object.keys(r.route.methods).join(', ').toUpperCase() + ' /api/admin' + r.route.path);
  }
});

console.log('Registered user routes:');
userRouter.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log('  ' + Object.keys(r.route.methods).join(', ').toUpperCase() + ' /api/user' + r.route.path);
  }
});


app.get('/', (req, res) => {
  res.send('API WORKING great');
});

app.listen(port, () => console.log("Server started on port ", port));