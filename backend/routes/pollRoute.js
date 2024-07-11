const express = require("express");
const router = express.Router();

//importing controller
const{signUp,login,getPollsbyUser} = require("../controller/UserController");
const{createPoll,addQuestions,getAPoll,getQA,getResponse} = require("../controller/Poll");
const{createVoter,Voting_verification,Voting,getPolls} = require("../controller/Voting");
console.log("Will route now");

//posting
router.post("/signUp",signUp);
router.post("/login",login);
router.get("/getPollsbyUser",getPollsbyUser);

router.post("/createPoll",createPoll);
router.post("/addQuestion",addQuestions);
router.get("/getAPoll",getAPoll);
router.get("/getQA",getQA);
router.get("/getResponse",getResponse);


router.post("/createVoter",createVoter);
router.post("/Voter_verification",Voting_verification);
router.post("/Voting",Voting);
router.get("/getPolls",getPolls);



module.exports = router;

