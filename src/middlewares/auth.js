export const auth = (privileges = []) => {
  return (req, res, next) => {
    privileges = privileges.map((p) => p.toLowerCase());

    if (privileges.includes("public")) {
      return next();
    }

    if (!req.session.user?.role) {
      return res
        .status(401)
        .json({ error: `Porfavor logueese, o problema con el rol` });
    }

    if (!privileges.includes(req.session.user.role.toLowerCase())) {
      return res
        .status(403)
        .json({ error: `Privilegios insuficientes` });
    }

    return next();
  };
};
