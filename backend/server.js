const express = require("express");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

app.use(express.json());

const dbConnect = require("./configs/database");
dbConnect();

console.log("going into route");
const route = require("./routes/pollRoute");
app.use("/api/v1",route);



app.listen(PORT,(req,res) => {
    console.log(`Lisening at Port ${PORT}`);
})

app.get("/",(req,res) => {
    res.send("PORT STARTED SUCCESSFULLY");
})