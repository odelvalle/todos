import { Document, Model } from 'mongoose'

interface Todo extends Document {
    id: string;
    todo: string,
    completed: boolean,
    created: Date
}

let todo: Model<Todo>;

export = todo;