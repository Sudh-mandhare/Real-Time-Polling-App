const mongoose = require("mongoose");
const VoterSchema = require("./Voter")

const QASchema = new mongoose.Schema({
    qa_id : {
        type: Number,
        require: false,

    },
    question:{
        type:String,
        required:true
    },
    options:[{
        option:{
            type:String,
            required:true
        },
        voter_id:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:VoterSchema
        },
    ]
    }]
});

module.exports = mongoose.model('QASchema',QASchema);