import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PlatformUser } from "@enterprise-commerce/core/platform/types";
import { createUser } from "../models/User";

export const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const newUser: PlatformUser = {
      id: null,
      email,
      password
    };

    const createdUser = await createUser(newUser);

    res.status(201).json({
      message: 'User registered successfully',
      user: createdUser
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};