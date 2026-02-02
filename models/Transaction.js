const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: { 
      type: String, 
      required: true, 
      enum: ["income", "expense", "transfer"] 
    },
    amount: { type: Number, required: true },
    category: { type: String, required: true }, 
    division: { 
      type: String, 
      required: true, 
      enum: ["office", "personal"] 
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
    account: { 
        type: String, 
        required: true,
        default: 'Main Account' 
    },
    
    paymentMethod: {
      type: String,
      enum: ["Cash", "UPI", "Cheque", "Bank Transfer", "N/A"],
      default: "N/A"
    },
    
    relatedTransaction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Transaction'
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Transaction", transactionSchema);