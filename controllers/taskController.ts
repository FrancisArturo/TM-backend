import type { Request, Response } from "express";
import { taskModel } from "../models/Task.ts";




export const getTasks = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getTaskByID = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const createTask = async ( req: Request, res: Response ) => {
    try {
        const {
            user: User, 
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist
        } = req.body;

        if (!Array.isArray(assignedTo)) {
            return res.status(400).json({
                ok: false,
                message: "assignedTo must be an array of user IDs"
            })
        }

        const task = await taskModel.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: User._id,
            todoChecklist,
            attachments
        })
        res.status(200).json({
            ok: true,
            message: "Task created successfully",
            task
        })
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const updateTask = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const deleteTask = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const updateTaskStatus = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const updateTaskChecklist = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getDashboardData = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getUserDashboardData = async ( req: Request, res: Response ) => {
    try {
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};



