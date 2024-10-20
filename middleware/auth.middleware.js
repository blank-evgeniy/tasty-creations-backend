const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).send("Access denied");
  }

  // Удаляем "Bearer " из токена, если он есть
  const bearerToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

  jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send("Invalid token");
    }

    // Сохраняем информацию о пользователе в объекте запроса
    req.user = decoded;
    next();
  });
};

const isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Доступ запрещен: требуется роль администратора" });
  }
  next();
};

module.exports = { authMiddleware, isAdmin };
