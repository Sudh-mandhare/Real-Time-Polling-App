const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.DATABASE_URL,{
        useNewUrlParser: true,
        useUnifiedTopology:true
    
    })
    .then(() =>{
        console.log("Data Base Connected successfully");
    })
    .catch(() => {
        console.log("failed to connect  database");
    })
}

module.exports = dbConnect;
