const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");

const register = async (data) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      const error = new Error("El email ya está registrado");
      error.status = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "STUDENT",
        parentId: data.parentId || null
      }
    });

    // Crear billetera para estudiantes
    if (user.role === "STUDENT") {
      await prisma.wallet.create({
        data: {
          studentId: user.id,
          balance: 0
        }
      });
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { email }
    });

    if (!user) {
      const error = new Error("Usuario no encontrado");
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      const error = new Error("Credenciales incorrectas");
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    };
  } catch (error) {
    throw error;
  }
};

module.exports = { register, login };