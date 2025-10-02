import express from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimmiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"
import job from "./config/cron.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT;

if(process.env.NODE_ENV === "production") job.start(); // start cron job only in production environment

//middleware
app.use(ratelimiter); 
app.use(express.json());


// Routes
app.get("/api/health" , (req,res) => {
    res.status(200).json({status: "OK"})
})

app.use("/api/transactions" , transactionsRoute);

// DataBase
initDB().then(() => {
app.listen(PORT , ()=> {
    console.log("Serve is running")
})

}) 
