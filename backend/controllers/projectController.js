import Project from "../models/Project.js"
import User from "../models/User.js"

const getProjects = async (req, res) => {
    const projects = await Project.find({
        '$or': [
            { 'collaborators': { $in: req.user } },
            { 'creator': { $in: req.user } }
        ]
    }).select('-tasks')
    //.where('creator').equals(req.user)

    res.json(projects)
}

const newProject = async (req, res) => {
    const project = new Project(req.body)
    project.creator = req.user._id
    try {
        const storedProject = await project.save()
        res.json(storedProject)
    } catch (error) {
        console.log(error)
    }

}

const getProject = async (req, res) => {
    const { id } = req.params
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {

            const project = await Project.findById(id)
                .populate({
                    path:'tasks',
                    populate:{path:'complete',select:'name'}})
                .populate('collaborators', 'name email')

            if (!project) {
                const error = new Error('Project does not exist')
                res.status(404).json({ msg: error.message })
            }
            if (project.creator.toString() !== req.user._id.toString() && !project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
                // const tasks = await Task.find().where('project').equals(project._id)
                const error = new Error('Invalid Action')
                return res.status(404).json({ msg: error.message })
            }

            res.json(project)


        } else {
            const error = new Error('Invalid ID')
            res.status(404).json({ msg: error.message })
        }

    } catch (error) {
        console.log(error)
    }
}

const editProject = async (req, res) => {
    const { id } = req.params
    const { name, description, deliverDate, client } = req.body
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project does not exist')
                return res.status(404).json({ msg: error.message })
            }
            if (project.creator.toString() === req.user._id.toString()) {
                project.name = name || project.name
                project.description = description || project.description
                project.deliverDate = deliverDate || project.deliverDate
                project.client = client || project.client

                const storedProject = await project.save()

                return res.json(storedProject)


            } else {
                const error = new Error('Invalid Action')
                return res.status(404).json({ msg: error.message })

            }
        } else {
            const error = new Error('Invalid ID')
            return res.status(404).json({ msg: error.message })
        }

    } catch (error) {
        console.log(error)
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params
    try {
        if (id.match(/^[0-9a-fA-F]{24}$/)) {
            // Yes, it's a valid ObjectId, proceed with `findById` call.
            const project = await Project.findById(id)

            if (!project) {
                const error = new Error('Project does not exist')
                return res.status(404).json({ msg: error.message })
            }
            if (project.creator.toString() === req.user._id.toString()) {
                await project.deleteOne()
                res.json({ msg: 'Deleted project' })
            } else {
                const error = new Error('Invalid Action')
                return res.status(403).json({ msg: error.message })

            }

        } else {
            const error = new Error('Invalid ID')
            return res.status(404).json({ msg: error.message })
        }

    } catch (error) {
        console.log(error)
    }
}

const searchCollaborator = async (req, res) => {
    const { email } = req.body

    const user = await User.findOne({ email }).select('-confirm,-createAdt,-password,-token,-updateAt,-__v')

    if (!user) {
        const error = new Error('User not found')
        return res.status(404).json({ msg: error.message })
    }

    return res.json(user)

}
const addCollaborator = async (req, res) => {
    const { id } = req.params

    const { email } = req.body
    const project = await Project.findById(id)

    if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({ msg: error.message })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Invalid Action')
        return res.status(404).json({ msg: error.message })
    }

    const user = await User.findOne({ email }).select('-confirm,-createAdt,-password,-token,-updateAt,-__v')
    console.log(user)
    if (!user) {
        const error = new Error('User not found')
        return res.status(404).json({ msg: error.message })
    }

    if (project.creator.toString() === user._id.toString()) {
        const error = new Error('The creator of the project cannot be the collaborator')
        return res.status(404).json({ msg: error.message })
    }

    if (project.collaborators.includes(user._id)) {
        const error = new Error('The user already belongs to the project')
        return res.status(404).json({ msg: error.message })
    }

    project.collaborators.push(user._id)
    await project.save()
    res.json({ msg: 'Collaborator added successfully' })



}

const deleteCollaborator = async (req, res) => {
    const { id } = req.params


    const project = await Project.findById(id)

    if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({ msg: error.message })
    }

    if (project.creator.toString() !== req.user._id.toString()) {
        const error = new Error('Invalid Action')
        return res.status(404).json({ msg: error.message })
    }

    project.collaborators.pull(req.body.id)
    await project.save()
    res.json({ msg: 'Collaborator deleted successfully' })
}


export {
    getProjects,
    newProject,
    getProject,
    editProject,
    deleteProject,
    addCollaborator,
    deleteCollaborator,
    searchCollaborator

}