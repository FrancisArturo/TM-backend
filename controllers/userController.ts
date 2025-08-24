import { userModel } from '../models/User.ts';
import { taskModel } from '../models/Task.ts';
import type { Request, Response } from 'express';


export const getUsers = async (req: Request, res:Response) => {
    try {
        const users = await userModel.find({ role: 'member' }).select("-password");

        //task counts for users
        const usersWithTaskCounts = await Promise.all( users.map( async user => {
            const pendingTasks = await taskModel.countDocuments({ assignedto: user._id, status: "Pending" });
            const inProgressTasks = await taskModel.countDocuments({ assignedto: user._id, status: "In Progress" });
            const completedTasks = await taskModel.countDocuments({ assignedto: user._id, status: "Completed" });
            return {
                ...user, //all user data
                pendingTasks,
                inProgressTasks,
                completedTasks
            }
        }));

        

        res.status(200).json({
            ok: true,
            usersWithTaskCounts
        })
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getUserById = async (req: Request, res:Response) => {
    try {
        const { uid } = req.params;
        const user = await userModel.findById(uid).select("-password");
        if (!user) {
            res.status(404).json({
                ok: false,
                message: "User not found"
            });
        };

        res.status(200).json({
            ok: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const deleteUser = async (req: Request, res:Response) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

