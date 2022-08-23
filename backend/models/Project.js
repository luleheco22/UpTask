import mongoose from "mongoose";

const projectsScjema= mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
    },
    description:{
        type:String,
        trim:true,
        required:true,
    },
    deliverDate:{
        type:Date,
        default: Date.now(),
    },
    client:{
        type:String,
        trim:true,
        required:true,
    },
    creator:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    tasks:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Task'
        }
    ],
    collaborators:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'  
        }
    ],

},{
    timestamps:true
});

const Project = mongoose.model('Project',projectsScjema)
export default Project