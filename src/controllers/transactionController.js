import { sql } from "../config/db.js";

async function getTransactionByUserId(req,res) {
        try {
            const {userId} = req.params
    
            const transactions = await sql `SELECT * FROM transactions WHERE user_id = ${userId}`;
            res.status(200).json(transactions);
    
        } catch (error) {
            console.log("Error Getting The Transaction" , error)
            res.status(500).json({message : "Internal Server Error"})
        }
    }

async function createTransaction(req,res) {
        try{
        const {user_id,title,amount,category} = req.body;
    
        if(!user_id || !title || !amount || !category === undefined){
            return res.status(400).json({message: "All Field Are Required"});
        }0
    
            const transactions = await sql `
            INSERT INTO transactions(user_id,title,amount, category)
            VALUES (${user_id},${title},${amount},${category})
            RETURNING *
            `
            console.log(transactions)
            res.status(201).json(transactions[0])
    } catch(error){
        console.log("Error Creating Transaction" , error)
        res.status(500).json({message:"Internal Server Error"})
    }
    }

async function  deleteTransaction (req,res) {
    try {
        
        const {id} = req.params;
        
                if(isNaN(parseInt(id))){
                    return res.status(400).json({message:"Invalid Transaction ID"})
                }

        const transactions = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`

        if(transactions.length === 0){
            return res.status(404).json({message: "Transaction Not Found"})
        }

        res.status(200).json({message:"Transaction Deleted Successfully"})

    } catch (error) {
        console.log("Error Deleting The Transaction" , error)
        res.status(500).json({message: "Internal Server Error" , error})
    }
}

async function  getSummary(req,res) {
    try {
        
        const {userId} = req.params;

        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount) , 0) as balance FROM transactions WHERE user_id = ${userId}`

        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount) , 0) as income FROM transactions WHERE user_id = ${userId} AND amount > 0`

        const expensesResult = await sql`
        SELECT COALESCE(SUM(amount) , 0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0`

        res.status(200).json({
            income: incomeResult[0].income,
            expense: expensesResult[0].expenses,
            balance: balanceResult[0].balance,
        })

    } catch (error) {
        console.log("Error Getting Transactions Summary", error)
        res.status(500).json({message: "Internal Server Error"})
    }   
}

export{getTransactionByUserId , createTransaction , deleteTransaction , getSummary};