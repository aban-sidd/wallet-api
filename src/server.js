import express from "express"
import dotenv from "dotenv"
import { initDB } from "./config/db.js";
import ratelimiter from "./middleware/rateLimmiter.js";
import transactionsRoute from "./routes/transactionsRoute.js"


dotenv.config();

const app = express();
const PORT = process.env.PORT;

//middleware
app.use(ratelimiter); 
app.use(express.json());


// Routes
app.use("/api/transactions" , transactionsRoute);

// DataBase
initDB().then(() => {
app.listen(PORT , ()=> {
    console.log("Serve is running")
})

}) 