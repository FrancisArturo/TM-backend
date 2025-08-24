import { ObjectId } from "mongoose";

export type Status = "Low" | "Medium" | "High";

export interface Filter {
    status?: Status
}

export interface ReportTask {
    title: String,
    description: String ,
    priority: String,
    status: String,
    dueDate: Date,
    assignedTo: ObjectId[],
    createdBy: ObjectId,
    attachments: String[],
    todoChecklist: TodoSchema[],
    progress: Number 
}

export  interface TodoSchema {
    text: String,
    completed: boolean
}

export type AssignedToPopulate = UserTaskReport[]

export interface UserTaskReport {
    name: String,
    email: String
}


export interface ReportTaskPopulate extends Omit<ReportTask, 'assignedTo'>{
    assignedTo: AssignedToPopulate
}

export interface User {
            $__: {
                activePaths: {
                    paths: {
                        password: String,
                        email: String
                        name: String,
                        profileImageUrl: String,
                        role: String,
                        _id: String,
                        createdAt: String,
                        updatedAt: String,
                        __v: String
                    },
                    states: {
                        require: {
                            password: boolean
                        },
                        default: {},
                        init: {
                            _id: boolean,
                            name: boolean,
                            email: boolean,
                            profileImageUrl: boolean,
                            role: boolean,
                            createdAt: boolean,
                            updatedAt: boolean,
                        __v: boolean
                        }
                    }
                },
                skipId: boolean,
                selected: {
                    password: Number
                },
                exclude: boolean
            },
            $isNew: boolean,
            _doc: {
                _id: String,
                name: String,
                email: String,
                profileImageUrl: String,
                role: String,
                createdAt: String,
                updatedAt: String,
                __v: Number
            }
}

export interface usersWithTaskCountsResponse {
    user: User,
    pendingTasks: Number,
    inProgressTasks: Number,
    completedTasks: Number
}