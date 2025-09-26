import validator from 'validator';
import bcrypt from 'bcryptjs'
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken'

// API TO REGISTER USER
const registerUser = async (req, res) => {

    try{
        const {name, email, password, } = req.body;
        if(!name || !email || !password ){
            return res.json({success: false, message: 'Missing details'});
        }

        //validating email format
        if(!validator.isEmail(email)){
            return res.json({success: false, message: 'Invalid email format'});
        }

        //validating strong password
        if(password.length < 8){
            return res.json({success: false, message: 'Password is not strong. It should be at least 8 characters long and include uppercase letters, lowercase letters, numbers, and symbols.'});
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name, 
            email,
            password : hashedPassword,
        }

        const newUser = new userModel(userData);
        const user = await newUser.save();

        const token =jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});
        
        res.json({success: true, message: 'User registered successfully', token});


        
        

    }catch(error){
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export {registerUser};