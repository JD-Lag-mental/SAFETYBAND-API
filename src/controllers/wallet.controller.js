const prisma = require("../config/prisma");

const getWallet = async (req, res, next) => {
  try {
    const wallet = await prisma.wallet.findUnique({
      where: { studentId: req.user.id },
      include: {
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 10
        }
      }
    });

    if (!wallet) {
      return res.status(404).json({ message: "Billetera no encontrada" });
    }

    res.status(200).json(wallet);
  } catch (error) {
    next(error);
  }
};

const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, description } = req.body;

    const wallet = await prisma.wallet.findUnique({
      where: { studentId: req.user.id }
    });

    if (!wallet) {
      return res.status(404).json({ message: "Billetera no encontrada" });
    }

    const transaction = await prisma.transaction.create({
      data: {
        amount,
        type,
        description,
        walletId: wallet.id
      }
    });

    // Actualizar balance de la billetera
    const newBalance = type === "CREDIT" 
      ? wallet.balance + amount 
      : wallet.balance - amount;

    if (newBalance < 0) {
      await prisma.transaction.delete({ where: { id: transaction.id } });
      return res.status(400).json({ message: "Saldo insuficiente" });
    }

    await prisma.wallet.update({
      where: { id: wallet.id },
      data: { balance: newBalance }
    });

    res.status(201).json({
      message: "Transacción creada exitosamente",
      transaction
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  createTransaction
};
