
const Transaction = require('../models/Transaction');

const checkEditLimit = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const currentTime = new Date();
        const createdTime = new Date(transaction.createdAt);
        
        
        const diffInMs = currentTime - createdTime;
        const diffInHours = diffInMs / (1000 * 60 * 60);

        if (diffInHours > 12) {
            return res.status(403).json({ 
                message: "Editing restricted: 12-hour limit exceeded." 
            });
        }

        next(); 
    } catch (error) {
        res.status(500).json({ message: "Server error checking edit permissions" });
    }
};

module.exports = checkEditLimit;