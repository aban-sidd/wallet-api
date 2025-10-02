import  ratelimit  from "../config/upstash.js";

const ratelimiter = async(req,res,next) => {
    try {
        // in a real world app you like to put the user_id or ipAddress as your key
        const {success} = await ratelimit.limit("my-rate-limit")

        if(!success){
            return res.status(429).json({
                message: "To May Request , Please Try Again Later"
            })
        }

        next();

    } catch (error) {
        console.log("Rate Limit Error" , error)
        next(error)
    }
}

export default ratelimiter;