const express = require("express");
const walletController = require("../controllers/wallet.controller");
const authenticate = require("../middlewares/auth.middleware");
const { walletTransactionSchema } = require("../schemas/validation");

const router = express.Router();

// Middleware para validar transacciones
const validateTransaction = (req, res, next) => {
  try {
    const validatedData = walletTransactionSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    next(error);
  }
};

router.get("/", authenticate, walletController.getWallet);
router.post("/transaction", authenticate, validateTransaction, walletController.createTransaction);

module.exports = router;
