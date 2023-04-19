const Expense = require('../models/expenses');
const User = require('../models/user');
const sequelize = require('../util/database');
const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk');
const uuidv1 = require('uuid');

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const addExpense = async (req, res) => {
    const { expenseamount, description, category } = req.body;
    console.log(req.body)
    const t = await sequelize.transaction();
    
    if (!expenseamount || isNaN(expenseamount)) {
        res.status(400).json({ message: "Please enter a valid expense expenseamount." });
        return;
    }
    if (!description) {
        res.status(400).json({ message: "Please enter a description of the expense." });
        return;
    }
    if (!category) {
        res.status(400).json({ message: "Please select a category for the expense." });
        return;
    }
    
    try {
        
    const token = req.header('Authorization');
    const decoded = jwt.verify(token, process.env.RAZORPAY_KEY_SECRET);
    const userId = decoded.userId;
    console.log(userId)
    
      // Create a new expense record in the database
        try {
        const expense = await Expense.create({
            expenseamount,
            description,
            category,
            userId
        }, {transaction: t });
        
        const user = await User.findByPk(userId);
        console.log(expenseamount)
        const totalExpense = Number(user.totalExpense) + Number(expenseamount);
        console.log(totalExpense)
        await user.update({ totalExpense }, { transaction: t})
        .then(async() => {
        await t.commit();
        return res.status(201).json({ expense, success: true });
        })
        } catch (error) {
        console.error(error);
        await t.rollback();
        return res.status(500).json({ success: false, error });
        }
    } catch (error) {
      // Send an error response if something went wrong
        console.error(error);
        await t.rollback();
        res.status(500).json({ message: "Something went wrong." });
    }
    }

    const getExpenses = async (UserId, page = 1, limit = 10) => {
        try {
            const expenses = await Expense.findAll({
            where: { UserId },
            limit,
            offset: (page - 1) * limit,
            order: [['createdAt', 'DESC']],
            });
        
            return expenses;
        } catch (error) {
            console.error(error);
            throw error;
        }
        };

        const showExpenses = async (req, res) => {
            let { page, limit } = req.query;
            page = parseInt(page) || 1; // default to page 1 if page parameter is missing or not a number
            limit = parseInt(limit) || 10; // default to 10
            
            try {
                const token = req.header('Authorization');
                const decoded = jwt.verify(token, process.env.RAZORPAY_KEY_SECRET);
                const UserId = decoded.userId;
            
                const expenses = await getExpenses(UserId, page, limit);
            
                const totalCount = await Expense.count({ where: { UserId } });
            
                res.status(200).json({
                expenses,
                totalCount,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Something went wrong.' });
                }
            };

const deleteExpense = (req, res) => {
    const expenseid = req.params.expenseid;
    Expense.destroy({where: { id: expenseid }}).then(() => {
        return res.status(204).json({ success: true, message: "Deleted Successfuly"})
    }).catch(err => {
        console.log(err);
        return res.status(403).json({ success: true, message: "Failed"})
    })
}

const downloadExpenses = async (req, res) => {
    try {
        if (!req.user.ispremiumuser) {
        return res.status(401).json({ success: false, message: 'User is not a premium User' });
        }
    
      const bucketName = 'your-bucket-name'; // Replace with your S3 bucket name
        const fileKey = `expenses_${uuidv1()}.txt`;
    
        const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: JSON.stringify(await req.user.getExpenses()),
        };
    
            await s3.upload(params).promise();
    
        const fileUrl = `https://${bucketName}.s3.amazonaws.com/${fileKey}`;
        res.status(201).json({ fileUrl, success: true });
    } catch (err) {
        res.status(500).json({ error: err, success: false, message: 'Something went wrong' });
    }
    };

module.exports = {
    deleteExpense,
    showExpenses,
    addExpense,
    downloadExpenses
}