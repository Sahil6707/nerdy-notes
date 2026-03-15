const express = require("express");
const router = express.Router();
const Purchase = require("../models/Purchase");
const authMiddleware = require("../middlewares/authMiddleware");


// Buy note
router.post("/buy", authMiddleware, async (req, res) => {

  try {

    const { noteId, price } = req.body;

    const purchase = new Purchase({
      user: req.user.id,
      note: noteId,
      price
    });

    await purchase.save();

    res.json({
      message: "Note purchased successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Purchase failed"
    });

  }

});

module.exports = router;