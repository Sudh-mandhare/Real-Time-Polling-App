const mongoose = require("mongoose");
const PollSchema = require("./Poll");

const UserSchema = new mongoose.Schema({

    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    polls_created:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:PollSchema,
        required:false
    }]
});

module.exports = mongoose.model('UserSchema',UserSchema);