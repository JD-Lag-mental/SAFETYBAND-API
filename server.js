const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const prisma = require("./src/config/prisma");

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/auth", require("./src/routes/auth.routes"));
app.use("/api/wallet", require("./src/routes/wallet.routes"));

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error);

  // Zod validation errors
  if (error.name === "ZodError") {
    return res.status(400).json({
      message: "Validation error",
      errors: error.errors.map(err => ({
        path: err.path.join("."),
        message: err.message
      }))
    });
  }

  // Prisma errors
  if (error.code === "P2002") {
    return res.status(409).json({
      message: "El email ya está registrado"
    });
  }

  if (error.code === "P2025") {
    return res.status(404).json({
      message: "Recurso no encontrado"
    });
  }

  // JWT errors
  if (error.message === "Token inválido" || error.message === "jwt malformed") {
    return res.status(403).json({
      message: "Token inválido"
    });
  }

  // Auth errors
  if (error.message === "Usuario no encontrado" || error.message === "Credenciales incorrectas") {
    return res.status(401).json({
      message: error.message
    });
  }

  // Generic error
  res.status(error.status || 500).json({
    message: error.message || "Error interno del servidor"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada"
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nCerrando aplicación...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
});
