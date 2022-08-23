import Project from "../models/Project.js"
import Task from "../models/Task.js"

const addTask = async (req, res) => {
    const { project } = req.body

    const existsProject = await Project.findById(project)
    if (!existsProject) {
        const error = new Error('The project does not exist')
        return res.status(404).json({ msg: error.message })
    }
    if (existsProject.creator.toString() === req.user._id.toString()) {
        try {
            const storedTask = await Task.create(req.body)
            existsProject.tasks.push(storedTask._id)
            await existsProject.save()
            res.json(storedTask)
        } catch (error) {
            return console.log(error)
        }
    } else {
        const error = new Error("You don't have the right permissions")
        return res.status(404).json({ msg: error.message })
    }

}
const getTask = async (req, res) => {
    const { id } = req.params
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const task = await Task.findById(id).populate('project')

        if (!task) {
            const error = new Error('Task does not exist')
            return res.status(404).json({ msg: error.message })
        }

        if (task.project.creator.toString() === req.user._id.toString()) {
            res.json(task)
        } else {
            const error = new Error('Invalid Action')
            return res.status(403).json({ msg: error.message })
        }

    } else {
        const error = new Error('Invalid ID')
        return res.status(404).json({ msg: error.message })
    }

}
const updateTask = async (req, res) => {
    const { id } = req.params
    const { name, description, priority, deliveryDate } = req.body
    if (id.match(/^[0-9a-fA-F]{24}$/)) {

        const task = await Task.findById(id).populate('project')

        if (!task) {
            const error = new Error('Task does not exist')
            return res.status(404).json({ msg: error.message })
        }

        if (task.project.creator.toString() === req.user._id.toString()) {
            task.name = name || task.name
            task.description = description || task.description
            task.priority = priority || task.priority
            task.deliveryDate = deliveryDate || task.deliveryDate

            try {
                const storedTask = await task.save()
                res.json(storedTask)
            } catch (error) {
                console.log(error)
            }


        } else {
            const error = new Error('Invalid Action')
            return res.status(403).json({ msg: error.message })
        }

    } else {
        const error = new Error('Invalid ID')
        return res.status(404).json({ msg: error.message })
    }
}
const deleteTask = async (req, res) => {
    const { id } = req.params
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const task = await Task.findById(id).populate('project')
            if (!task) {
                const error = new Error('Task does not exist')
                return res.status(404).json({ msg: error.message })
            }
            if (task.project.creator.toString() === req.user._id.toString()) {

                const project = await Project.findById(task.project)
                project.tasks.pull(task._id)
                // await project.save()
                // await task.deleteOne()

                await Promise.allSettled([
                    await project.save(),
                    await task.deleteOne()
                ])

                res.json({ msg: 'Deleted task' })
            } else {
                const error = new Error('Invalid Action')
                res.status(403).json({ msg: error.message })

            }

        } else {
            const error = new Error('Invalid ID')
            res.status(404).json({ msg: error.message })
        }

    } catch (error) {
        console.log(error)
    }
}
const changeStatus = async (req, res) => {
    const { id } = req.params
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            const task = await Task.findById(id).populate('project')
            if (!task) {
                const error = new Error('Task does not exist')
                return res.status(404).json({ msg: error.message })
            }

            if (task.project.creator.toString() !== req.user._id.toString() && !task.project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
                const error = new Error('Invalid Action')
                res.status(403).json({ msg: error.message })
            }

            task.state = !task.state
            task.complete = req.user._id
            await task.save()
            const storedTask = await Task.findById(id)
                .populate('project')
                .populate('complete')

            res.json(storedTask)


        } else {
            const error = new Error('Invalid ID')
            res.status(404).json({ msg: error.message })
        }

    } catch (error) {
        console.log(error)
    }
}

export {
    addTask,
    getTask,
    updateTask,
    deleteTask,
    changeStatus
}