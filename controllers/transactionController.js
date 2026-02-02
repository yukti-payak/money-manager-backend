const Transaction = require('../models/Transaction');


exports.addTransaction = async (req, res) => {
    try {
        const { type, amount, category, division, description } = req.body;

       
        const transaction = await Transaction.create({
            type,
            amount,
            category,
            division,
            description
        });

        res.status(201).json({
            success: true,
            data: transaction
        });
    } catch (error) {
       
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};



exports.getTransactions = async (req, res) => {
    try {
        const { division, category, startDate, endDate } = req.query;
        let query = {};

        
        if (division) query.division = division.toLowerCase();

    
        if (category) query.category = category;

        
        if (startDate && endDate) {
            query.date = { 
                $gte: new Date(startDate), 
                $lte: new Date(endDate) 
            };
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        
        const updatedTransaction = await Transaction.findByIdAndUpdate(
            id, 
            req.body, 
            { new: true, runValidators: true }
        );

        if (!updatedTransaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            data: updatedTransaction
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


exports.getStats = async (req, res) => {
    try {
        const { timeframe } = req.query; 
        let dateLimit = new Date();

        if (timeframe === 'weekly') dateLimit.setDate(dateLimit.getDate() - 7);
        else if (timeframe === 'monthly') dateLimit.setMonth(dateLimit.getMonth() - 1);
        else if (timeframe === 'yearly') dateLimit.setFullYear(dateLimit.getFullYear() - 1);

        const stats = await Transaction.aggregate([
            { $match: { date: { $gte: dateLimit } } },
            {
                $group: {
                    _id: "$type",
                    totalAmount: { $sum: "$amount" }
                }
            }
        ]);
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};




exports.transferFunds = async (req, res) => {
    const { account, toAccount, amount, method, description, division } = req.body;
    
    try {
        const transferNote = description || `Transfer via ${method}`;

        
        await Transaction.create({
            type: 'expense',
            amount,
            category: 'Transfer',
            division: division || 'Personal',
            description: `${transferNote} (To: ${toAccount})`,
            account: account,
            paymentMethod: method 
        });

        
        await Transaction.create({
            type: 'income',
            amount,
            category: 'Transfer',
            division: division || 'Personal',
            description: `${transferNote} (From: ${account})`,
            account: toAccount,
            paymentMethod: method
        });

        res.status(201).json({ success: true, message: "Transfer successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


exports.getCategoryBreakdown = async (req, res) => {
    try {
        const breakdown = await Transaction.aggregate([
            { $match: { type: 'expense' } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }
        ]);
        res.status(200).json({ success: true, data: breakdown });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const transaction = await Transaction.findByIdAndDelete(id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: 'Transaction not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Transaction deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};