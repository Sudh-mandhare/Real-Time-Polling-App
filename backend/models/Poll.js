const mongoose = require("mongoose");
const QASchema = require("./QandA");
const UserSchema  = require("./User");

const PollSchema = new mongoose.Schema({
    poll_name:{
        type:String,
        required :true
    },
    poll_creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserSchema',
        required:true
    },
    QA :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:QASchema,
        required : false

    }],

    voters_email:[{
        type:String,
        required:false
    }],
    verified_voters:[{
        type:String,
        required:false
    }],
    verify_check:{
        type:Boolean,
        required:true
    }

});

module.exports = mongoose.model('PollSchema',PollSchema);