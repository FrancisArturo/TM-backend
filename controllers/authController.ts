import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/User.ts';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';




const generateToken = (userId: Types.ObjectId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: "7d" })
};


export const registerUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken } = req.body;

        //check if user exists
        const userExists = await userModel.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        };

        //role asigment
        let role = "";

        if( adminInviteToken && adminInviteToken === process.env.ADMIN_INVITE_TOKEN){
            role = "admin"
        } else {
            role = "member"
        };

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create user
        const user = await userModel.create({
            name,
            email,
            password: hashedPassword,
            profileImageUrl,
            role
        });

        //return data with token
        res.status(201).json({
            ok: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if(!user) {
            return res.status(401).json({ 
                ok: false,
                message: "Invalid email or password"
            });
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({
                ok: false,
                message: "Invalid email or password"
            });
        }

        //return user with token
        res.json({
            ok: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profileImageUrl: user.profileImageUrl,
                token: generateToken(user._id)
            }
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            error 
        });
    }
};

export const getUserProfile = async (req: Request, res: Response) => {
    try {
        const { user: User } = req.body;
        const user = await userModel.findById(User.id).select("-password");
        if(!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        };
        res.status(200).json({
            ok: true,
            user
        })
    } catch (error) {
        res.status(500).json({
            ok: false, 
            error 
        });
    }
};

export const updateUserProfile = async (req: Request, res: Response) => {

    try {
        const { user: User, name, email, password } = req.body;
        const user = await userModel.findById(User.id);

        if(!user) {
            return res.status(404).json({
                ok: false,
                message: "User not found"
            });
        }

        user.name = name || user.name;
        user.email = email || user.email;

        if(password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        const updateUser = await user.save();

        res.status(200).json({
            ok: true,
            user: {
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                role: updateUser.role,
                token: generateToken(updateUser._id)
            }
            
        })
    } catch (error) {
        res.status(500).json({
            ok: false, 
            error 
        });
    }
};


