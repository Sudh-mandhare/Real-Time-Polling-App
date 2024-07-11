const VoterSchema = require("../models/Voter");
const PollSchema = require("../models/Poll");
const QASchema = require("../models/QandA");

const createVoter = async(req,res) => {
    try{
        const{voter_name,voter_email,voter_contact} = req.body;

        if(!voter_name || !voter_email || !voter_name)
        {
            throw Error('please enter all the necessary fields');
        }
        
        const alreadyUser = await VoterSchema.findOne({voter_email});
        if(alreadyUser)
        {
            console.log("Welcome back ... Responsible Voter :)");
        }
        //if already existing voter -> based on email...welcome back and take all necessay details from the previous content -> it will require a different function all together

        const NewVoter = await VoterSchema.create({
            voter_name,
            voter_email,
            voter_contact
        })

        res.status(201).json({
            success:true,
            message:"Voter created successfully",
            new_voter : NewVoter
        })

        

    }
    catch(err){
        console.log("Failed to create the voter");
        res.status(201).json({
            success:false,
            message:err.message
        })
    }
}


const Voting_verification = async(req,res) => {
    try{
        const{poll_id,voter_id,voter_email} = req.body;

        if(!poll_id || !voter_id || !voter_email)
        {
            throw Error('Did not receive all the necessary inputs');
        }

        const poll = await PollSchema.findOne({_id:poll_id});

        if(!poll)
        {
            throw Error('Did not find any such poll');
        }

        const verify_check = poll.verify_check;

        if(verify_check)
        {
            //if true then need to verify voters

            if(!poll.verified_voters.includes(voter_email))
            {
                throw Error('You are not a verified Voter..Please ask the Author to Verify You');
            }
        }

        const alreadyVoted = await PollSchema.findOne({ voters_email: { $in: [voter_email] } });
        
        if(alreadyVoted)
        {
            throw Error('The Voter has already voted here');
        }

        //adding to voter's email

        const UpdatedPoll = await PollSchema.findOneAndUpdate(poll,{$push:{voters_email:voter_email}},{new:true});

        res.status(301).json(({
            success:true,
            message:"You can proceed to Vote ..Voting for the poll verified successfully",
            updatedPoll:UpdatedPoll
        }))

    }
    catch(err){
        console.log("Failed to execute the Voting_verification function");
        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}

const Voting = async(req,res) => {
    try{
        const{poll_id,voter_id,question_id,selection} = req.body;

        if(!poll_id || !voter_id || !question_id || !selection)
        {
            throw Error('Did no receive all the necessary details');
        }

        //this check is not really needed
        const poll = await PollSchema.findOne({_id:poll_id});

        if(!poll.QA.includes(question_id))
        {
            throw Error('The question is not from this poll..there is an error');
        }

        const question = await QASchema.findById(question_id);
        

        const UpdateQuestion = await QASchema.findOneAndUpdate(
            question ,
            { $push: { [`options.${selection}.voter_id`]: voter_id } },
            { new: true }
        );
        
        //NOTE : done only after click on confirm response on frontend
        // Another option of delete response to be added later\
        //AND At the end only option of END POLLING

        res.status(201).json({
            success:true,
            message:'Option selection done successfully',
            question:question
        })

    }
    catch(err) {
        console.log("Failed to select the option on clicking confirm response");

        res.status(401).json({
            success:false,
            message:err.message
        })
    }
}

const getPolls = async(req,res) => {
    try {
        const polls = await PollSchema.find(); // Retrieve only the '_id' field
        
        const pollReferences = polls.map(poll => poll._id);

        console.log({pollReferences});

        return res.status(200).json({ pollReferences });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};




module.exports = {createVoter,Voting_verification,Voting,getPolls};

