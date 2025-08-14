import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'


// type userId = 


// const generateToken = (userId) => {
//     return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" })
// };


export const registerUser = async (req: Request, res: Response) => {};

export const loginUser = async (req: Request, res: Response) => {};

export const getUserProfile = async (req: Request, res: Response) => {};

export const updateUserProfile = async (req: Request, res: Response) => {};


