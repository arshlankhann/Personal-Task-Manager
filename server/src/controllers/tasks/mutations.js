const Task = require('../../models/Task');


const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body
        const task = await Task.create({ title, description, dueDate })
        res.status(201).json(task)
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' })
    }
}


const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, dueDate } = req.body;
        const task = await Task.findByIdAndUpdate(id, { title, description, dueDate }, { returnDocument: 'after' })
        if (!task) {
            return res.status(404).json({ error: 'Task not found' })
        }
        res.json(task)
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" })
    }
}

const deleteTask = async (req,res)=>{
    try{
        const {id} = req.params;
        const task = await Task.findByIdAndDelete(id);
        if(!task){
            return res.status(404).json({error:'Task not found'})
        }
        res.json({ message: 'Task deleted successfully', task })
    } catch (error){
        res.status(500).json({ error: 'Failed to delete task' });
    }
}




module.exports = { createTask, updateTask, deleteTask };


