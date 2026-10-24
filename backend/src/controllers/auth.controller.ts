import type { RequestHandler } from "express";
import { loginUser, registerUser } from "../services/auth.service";

export const register: RequestHandler = (req, res) => {
  const result = registerUser({
    name: req.body?.name,
    email: req.body?.email,
    password: req.body?.password,
  });

  res.status(201).json({ data: result });
};

export const login: RequestHandler = (req, res) => {
  const result = loginUser({
    email: req.body?.email,
    password: req.body?.password,
  });

  res.json({ data: result });
};
