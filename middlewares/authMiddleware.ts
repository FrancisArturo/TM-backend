import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/User.ts';

type Decode = {
    id: string
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith("Bearer")){
            token = token.split(" ")[1];
            const decoded = (jwt.verify(token, process.env.JWT_SECRET as string)) as Decode;
            req.body.user = await userModel.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({
                ok: false, 
                message: "Not authorized, no token" 
            });
        }
    } catch (error) {
        res.status(401).json({
            ok: false,
            message: "Token failed" 
        });
    }
};


export const adminOnly = (req: Request, res: Response, next: NextFunction) => {

    const { user } = req.body;
    if(user && user.role === "admin") {
        next();
    } else {
        res.status(403).json( { 
            ok: false,
            message: "Access denied, admin only"
        });
    }
}