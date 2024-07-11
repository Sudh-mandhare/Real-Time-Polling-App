const mongoose = require("mongoose");

const VoteSchema = new mongoose.Schema({
    voter_id : {
        type: Number,
        require: false,
    },
    voter_name : {
        type:String,
        required:true
    },
    voter_email :{      //it is a list of email of voters who have voted already
        type:String,
        required:true
    },
    voter_contact : {
        type:String,
        required:true
    }
});

module.exports = mongoose.model('VoterSchema',VoteSchema);