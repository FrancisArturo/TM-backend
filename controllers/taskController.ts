import type { Request, Response } from "express";
import { taskModel } from "../models/Task.ts";
import type { Filter, Status } from "../types.d.ts";




export const getTasks = async ( req: Request, res: Response ) => {
    try {
        const { status } = req.query;
        const { user } = req.body;
        let filter:Filter = {};

        if(status){
            filter.status = status as Status;
        }

        let tasks = user.role === "admin"
            ? await taskModel.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            )
            : await taskModel.find({ ...filter, assignedTo: user._Id }).populate(
                "assignedTo",
                "name email profileImageUrl"
            )

        //completed TodoChecklist count for each task
        tasks = await Promise.all(
            tasks.map( async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return {...task._doc, completedTodoCount: completedCount}
            })
        );

        //status summary
        const allTasks = await taskModel.countDocuments(
            user.role === "admin" 
                ? {}
                : { assignedTo: user._id }
        );

        const pendingTask = await taskModel.countDocuments({
            ...filter,
            status: "Pending",
            ...(user.role !=="admin" && {assignedTo: user._id})
        });

        const inProgressTask = await taskModel.countDocuments({
            ...filter,
            status: "In Progress",
            ...(user.role !=="admin" && {assignedTo: user._id})
        });

        const completedTask = await taskModel.countDocuments({
            ...filter,
            status: "Completed",
            ...(user.role !=="admin" && {assignedTo: user._id})
        });

        res.status(200).json({
            ok: true,
            tasks,
            statusSumary : {
                all: allTasks,
                pendingTask,
                inProgressTask,
                completedTask
            }
        })

    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getTaskByID = async ( req: Request, res: Response ) => {
    try {
        
        const { tid } = req.params;

        const task = await taskModel.findById(tid).populate(
            "assignedTo",
            "name email profileImgUrl"
        );

        if (!task) {
            return res.status(400).json({
                ok: false,
                message: "Task not found"
            });
        }

        return res.status(200).json({
            ok: true,
            task
        });
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
            });
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
        });
        res.status(200).json({
            ok: true,
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error",
        });
    }
};

export const updateTask = async ( req: Request, res: Response ) => {
    try {
        
        const { tid } = req.params;

        const { title, description, priority, dueDate, todoChecklist, attachments, assignedTo } = req.body;

        const task = await taskModel.findById(tid);

        if (!task) return res.status(404).json({
            ok: false,
            message: "Task not found"
        });

        task.title = title || task.title;
        task.description = description || task.description;
        task.priority = priority || task.priority;
        task.dueDate = dueDate || task.dueDate;
        task.todoChecklist = todoChecklist || task.todoChecklist;
        task.attachments = attachments || task.attachments;

        if (assignedTo) {
            if(!Array.isArray(assignedTo)) {
                return res.status(400).json({
                    ok: false,
                    message: "assignedTo must be an array of user IDs"
                })
            }
        };

        task.assignedTo = assignedTo || task.assignedTo;

        const updateTask = await task.save();

        return res.status(200).json({
            ok: true,
            message: "Task update successfully",
            updateTask
        })

    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const deleteTask = async ( req: Request, res: Response ) => {
    try {
        const { tid } = req.params;

        const task = await taskModel.findById(tid);

        if (!task) return res.status(404).json({
            ok: false,
            message: "Task not found"
        });

        await task.deleteOne();

        return res.status(200).json({
            ok: true,
            message: "Task deleted successfully"
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const updateTaskStatus = async ( req: Request, res: Response ) => {
    try {
        const { user, status } = req.body;
        const { tid } = req.params;

        const task = await taskModel.findById(tid);

        if (!task) {
            return res.status(404).json({
                ok: false,
                message: "Task not found"
            })
        };

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === user._id.toString()
        );

        if (!isAssigned && user.role !== "admin") {
            return res.status(403).json({
                ok: false,
                message: "Not authorized"
            });
        }

        task.status = status || task.status;

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        
        return res.status(200).json({
            ok: true,
            message: "Task status update",
            task
        });
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const updateTaskChecklist = async ( req: Request, res: Response ) => {
    try {
        const { user, todoChecklist } = req.body;
        const { tid } = req.params;

        const task = await taskModel.findById(tid);

        if (!task) {
            return res.status(404).json({
                ok: false,
                message: "Task not found"
            })
        }

        if (!task.assignedTo.includes(user._id) && user.role !== "admin") {
            return res.status(403).json({
                ok: false,
                message: "Not authorized to update checklist",
            })
        }

        task.todoChecklist = todoChecklist; //updated checklist

        //auto-update progress based on checklist
        const completedCount = task.todoChecklist.filter(
            (item) => item.completed 
        ).length;

        const totalItems = task.todoChecklist.length;

        task.progress = totalItems > 0 
            ? Math.round((completedCount / totalItems) * 100) 
            : 0;

        //auto-mark task as completed if all items arec checked
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        await task.save();

        const updateTask = await taskModel.findById(tid).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        return res.status(200).json({
            ok: true,
            message: "Task Checklist updated",
            task: updateTask
        });
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getDashboardData = async ( req: Request, res: Response ) => {
    try {
        //fetch statistics
        const totalTasks = await taskModel.countDocuments();
        const pendingTasks = await taskModel.countDocuments({status: "Pending"});
        const completedTasks = await taskModel.countDocuments({status: "Completed"});
        const overdueTasks = await taskModel.countDocuments({status: { $ne: "Completed"}, dueDate: { $lt: new Date()} });

        //Ensure all possible statues are included
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await taskModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks; //Add total count to taskDistribution

        //Ensure all priority levels are included
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await taskModel.aggregate([
            {
                $group: {
                    _id: "$priority",
                    count: { $sum: 1 },
                },
            },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        //Fetch recent 10 tasks
        const recentTasks = await taskModel.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
        
        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        });       
    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};

export const getUserDashboardData = async ( req: Request, res: Response ) => {
    try {
        const { user } = req.body;

        //fetch statistics for user specifics
        const totalTasks = await taskModel.countDocuments({ assignedTo: user.id });
        const pendingTasks = await taskModel.countDocuments({assignedTo: user.id, status: "Pending"});
        const completedTasks = await taskModel.countDocuments({assignedTo: user.id, status: "Completed"});
        const overdueTasks = await taskModel.countDocuments({
            assignedTo: user.id, 
            status: { $ne: "Completed"}, 
            dueDate: { $lt: new Date()} 
        });

        //task distribution by status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistributionRaw = await taskModel.aggregate([
            {
                $match: {
                    assignedTo: user.id
                }
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                },
            },
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, "");
            acc[formattedKey] = taskDistributionRaw.find((item) => item._id === status)?.count || 0;
            return acc;
        }, {});
        taskDistribution["All"] = totalTasks;

        //task distribution by priority
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await taskModel.aggregate([
                {
                    $match: {
                        assignedTo: user.id
                    }
                },  
                {
                    $group: {
                        _id: "$priority",
                        count: { $sum: 1 },
                    }
                }
        ]);
        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc;
        }, {});

        //Fetch recent 10 tasks for the user
        const recentTasks = await taskModel.find({ assignedTo: user.id})
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");

        return res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks
            },
            charts: {
                taskDistribution,
                taskPriorityLevels
            },
            recentTasks
        }); 

    } catch (error) {
        res.status(500).json({
            ok: false, 
            message: "Server error" 
        });
    }
};



