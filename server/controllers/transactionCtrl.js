const transactionModel=require('../models/transactionModel.js');
const moment = require('moment');
const jwt = require('jsonwebtoken');




const getAllTransaction=async(req,res)=>{
    try{
        const {frequency,selectedDate,type }=req.body;
        const transactions=await transactionModel.find({
          ...(frequency !=='custom'?{
            date:{
                $gt:moment().subtract(frequency,'days').toDate(),
           },
        }:{
            date:{
                $gte:selectedDate[0],
                $lte:selectedDate[1]
            },   
        
        }) ,
            userid:req.body.userid,
        ...(type !=='all'&& {type}),
        });
       
        res.status(200).json(transactions);
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
};

  

const editTransaction=async(req,res)=>{

    try{
        await transactionModel.findByIdAndUpdate(
            {
                _id:req.body.transactionId
            },
            req.body.payload
        );
        res.status(200).json({message:"Edit Successfull"});
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:err.message});
    }
}

  

const delTransaction=async(req,res)=>{

    try{
        await transactionModel.findOneAndDelete({_id:req.body.transactionId});
        res.status(200).json({ message: 'Delete Successful' });
    }
    catch(err){
        console.log(err);
       res.status(500).json({error:err.message});
    }
}

  


const addTransaction=async(req,res)=>{
     try{
        const newTransaction=new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).json({ message: 'Transaction Created Successfully' });
     }
     catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });  // Send error as JSON
     }
};

  

module.exports={getAllTransaction,addTransaction,editTransaction,delTransaction};