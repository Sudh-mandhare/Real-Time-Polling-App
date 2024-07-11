const UserSchema = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const createToken = (_id) =>{
    return jwt.sign({_id: _id},process.env.JWT_SECRET,{expiresIn:'1d'});
}

const signUp = async(req,res) =>{
    console.log("started with signup");
    try{
        const{email,password} = req.body;

        if(!email || !password)
        {
            throw Error('Enter both the fields');
        }

        if(!validator.isEmail(email))
        {
            throw Error('Enter a valid email');
        }
        if(!validator.isStrongPassword(password))
        {
            throw Error('Enter a Strong Password')
        }

        //now as all cases held / check if already existing email
        const existingAccount = await UserSchema.findOne({email});
        if(existingAccount)
        {
            throw Error('Email already registered with us .. try logging in');
        }
        
        const hash = await bcrypt.hash(password, 10);        
        
        
        try{
            const NewAccount = await UserSchema.create({
                email,
                password:hash
            });

            const token = createToken(NewAccount._id);
            // note: _id available only after user created 
    
            return res.status(201).json({
                success:true,
                token:token,
                email:email,
                message:"Data base creation was a success",
                data:NewAccount
            })

        }
        catch(error)
        {
            console.log(error);
            res.status(501).json({
                message:"Failed to create entry in db",
            })
        }
        
    }

    catch(err) {
        return res.status(401).json({
            success:false,
            message:err.message
        })
    }
    
}

const login = async(req,res) => {

    try{
        const {email,password} = req.body;

        if(!email || !password)
        {
            throw Error('Enter all the fields');
        }

        const existingUser = await User.findOne({email});

        if(!existingUser)
        {
            throw Error('Enter a valid Email');
        }

        const verify = bcrypt.compareSync(password,existingUser.password);

        if(!verify)
        {
            throw Error('incorrect password');
        }
        
        const token = createToken(existingUser._id);
        res.status(201).json({
            success:true,
            token : token,
            email : email
        })
    }
    catch(err){
        console.log("Failed in logging in ");

        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}

const getPollsbyUser = async(req,res) => {
    try{
        const {user_id} = req.query;

        const user = await UserSchema.findById(user_id );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const poll_arr = user.polls_created;

        res.status(200).json({
            poll_arr
        })
    }
    catch(err)
    {
        console.log("Failed to get polls created by user array");
        res.status(404).json({
            success:false,
            message:err.message
        })
    }
}

module.exports = {signUp,login,getPollsbyUser};