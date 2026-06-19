const Task = require('../../models/Task');


async function getAllTasks(req, res) {
    try {
        const task = await Task.find().sort({ order: 1 })
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch tasks" })
    }
}

async function getTaskById(req,res) {
    try{
        const {id} = req.params;
        const task = await Task.findById(id);
        if(!task){
            return res.status(404).json({error: "Task not found"})
        }
        res.json(task);
    }catch(error){
        res.status(500).json({error: "Failed to fetch task"})
    }
}

module.exports = { getAllTasks, getTaskById}