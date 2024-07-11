const express = require("express");

const PollSchema = require("../models/Poll");
const QASchema = require("../models/QandA");
const UserSchema = require("../models/User");

const createPoll = async(req,res) => {
    try{
        const {poll_name,verify_check,verified_voters,user_id} = req.body;

        if(!poll_name || !user_id)
        {
            throw Error('Please add all the necessay details');
        }

        const check = await PollSchema.findOne({poll_name});

        if(check)
        {
            throw Error('Poll with Similar name already exist');
        }
        
        const NewPoll = await PollSchema.create({
            poll_name,
            poll_creator : user_id,
            verify_check,
            verified_voters
        });

        const user = await UserSchema.findById(user_id)
        const UpdatedUser = await UserSchema.findOneAndUpdate(
            user, // Assuming _id is the field name for user ID
            { $push: { polls_created: NewPoll._id } },
            { new: true }
        );
    
        res.status(201).json({
            success:true,
            message: 'Poll create successfully',
            poll: NewPoll,
            updatedUser : UpdatedUser
            
        })

    }
    catch(err){
        console.log("Failed to create Poll");

        res.status(401).json({
            success:false,
            message:err.message
            
        })

    }
}

const addQuestions = async(req,res) =>{
    try{
        const{poll_id,question,options} = req.body;

        if(!question || !options ||!Array.isArray(options) ||options.length == 0)
        {
            throw Error('Please add the question as well as the options');
        }

        const NewQuestion = await QASchema.create({
            question,
            options:options.map(option =>({option, voter_id:[]}))
        })

        const poll = PollSchema.findOne({_id:poll_id});
        if(!poll)
            {
                throw Error('No poll with given Id exist');
            }

        const UpdatePoll = await PollSchema.findOneAndUpdate(poll,{$push:{QA:NewQuestion._id}},{new:true});

        res.status(301).json({
            success:true,
            message:"Question Added Successfully",
            question:UpdatePoll
        })


    }
    catch(err){
        console.log("Failed to add Question");
        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}

const getAPoll = async (req, res) => {
    try {

        const { poll_id } = req.query;

        if (!poll_id) {
            throw new Error('Please enter all the fields');
        }

        const poll = await PollSchema.findOne({ _id : poll_id});

        if (!poll) {
            return res.status(404).json({
                success: false,
                message: 'Poll not found'
            });
        }

        return res.status(200).json({
            data:poll
        });

    } 
    catch (err) {
        console.error("Failed to retrieve a poll by poll_id:", err.message);

        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve poll'
        });
    }
};

const getQA = async (req,res) => {
    try{
        const{ques_id} = req.query;

        const QA_object = await QASchema.findById(ques_id);

        if(!QA_object)
        {
            throw Error('Empty object retrived from given id');
        }

        const question = QA_object.question;

        let option_arr = [];

        QA_object.options.forEach(it => option_arr.push(it.option));

        res.status(301).json({
            question : question,
            option : option_arr
        })

    }
    catch(err){
        console.log("failed while retriving questions from ques_id")
        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}

const getResponse = async(req,res) => {
    try{
        const{ques_id} = req.query;

        const QA_object = QASchema.findById(ques_id);

        let counts_arr = [];

        console.log(QA_object.schema.obj) ;
        
        
        options.forEach(it => console.log(it.voter_id) );

        res.status(301).json({
            success:true
        })
    }
    catch(err){
        console.log("Failed to get response of vote count per option");
        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}
module.exports = {createPoll,addQuestions,getAPoll,getQA,getResponse};