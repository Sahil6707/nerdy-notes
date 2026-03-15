const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  note: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Note"
  },

  price: {
    type: Number
  },

  purchasedAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Purchase", purchaseSchema);