const mongoose = require("mongoose");

const ladgerSchema = new mongoose.Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "account",
        required: [true, "Account is required for ledger entry"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required ledger entry"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction",
        required: [true, "Transaction id is required"],
        immutable: true,
        index: true
    },
    type: {
        type: String,
        enum: ["DEBIT", "CREDIT"],
        required: [true, "Ledger type is required"],
        immutable: true
    }
}, {
    timestamps: true
});

// Prevent update via save
ladgerSchema.pre("save", function () {
    if (!this.isNew) {
        return next(new Error("Ledger entries are immutable"));
    }
});

// Block all updates
[
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "findByIdAndUpdate",
  "replaceOne"
].forEach((op) => {
  ladgerSchema.pre(op, function () {
    throw new Error("Ledger entries cannot be updated");
  });
});

// Block all deletes
[
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
  "findByIdAndDelete"
].forEach((op) => {
  ladgerSchema.pre(op, function () {
    throw new Error("Ledger entries cannot be deleted");
  });
});

module.exports = mongoose.model("ledger", ladgerSchema);