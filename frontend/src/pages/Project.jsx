import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import Alert from "../components/Alert";
import Collaborator from "../components/Collaborator";
import ModalDeleteCollaborator from "../components/ModalDeleteCollaborator";
import ModalDeleteTask from "../components/ModalDeleteTask";
import ModalFormTask from "../components/ModalFormTask";
import Task from "../components/Task";
import useAdmin from "../hooks/useAdmin";
import useProjects from "../hooks/useProjects";
import io from "socket.io-client";
import {BounceLoader} from 'react-spinners'
let socket;

const Project = () => {
  const params = useParams();
  const { id } = params;

  const { getProject, project, loading, handleModalTask, submitTasksProject,deleteTaskProject,updateTaskProject,changeStateTaskProject } =
    useProjects();

  const admin = useAdmin();

  useEffect(() => {
    getProject(id);
  }, []);

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL);
    socket.emit("open project", id);
  }, []);

  useEffect(() => {
    socket.on("added task", (newTask) => {
      if (newTask.project === project._id) {
        submitTasksProject(newTask);
      }
    });

    socket.on('deleted task',(deletedTask)=>{
       if (deletedTask.project===project._id) {
        deleteTaskProject(deletedTask)
       }
    })

    socket.on('updated task',(updatedTask)=>{
      if (updatedTask.project._id===project._id) {
          updateTaskProject(updatedTask)
      }
    })

    socket.on('new state',(newStateTask)=>{
      if (newStateTask.project._id===project._id) {
          changeStateTaskProject(newStateTask)
      }
    })
  });

  const { name, _id } = project;

  return loading ? (
    <BounceLoader className="m-auto flex justify-center absolute top-1/2" size={100} loading color="#2600ff" />
  ) : (
    <>
      <div className="flex justify-between">
        <h1 className="font-black font-fredoka text-4xl">{name}</h1>
        {admin && (
          <div className="flex items-center gap-0 text-gray-400 hover:text-yellow-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            <Link
              to={`/projects/edit/${_id}`}
              className="uppercase font-bold font-fredoka"
            >
              Edit
            </Link>
          </div>
        )}
      </div>

      {admin && (
        <button
          type="button"
          onClick={() => handleModalTask()}
          className="text-sm px-5 py-3 w-full md:w-auto rounded-lg uppercase 
      font-fredoka text-white bg-sky-500 hover:bg-sky-600 text-center mt-5 flex gap-2 items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Task
        </button>
      )}

      <p className="font-fredoka text-xl mt-10">Project Tasks</p>

      <div className="bg-white shadow mt-10 rounded-lg">
        {project.tasks?.length ? (
          project.tasks?.map((task) => <Task key={task._id} task={task} />)
        ) : (
          <p className="text-center my-5 p-10">
            There are no tasks in this project
          </p>
        )}
      </div>

      {admin && (
        <>
          <div className="flex items-center justify-between mt-10">
            <p className="font-fredoka text-xl">Collaborators</p>
            <div className="flex items-center gap-0 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <Link
                to={`/projects/new-collaborator/${project._id}`}
                className="text-gray-400 uppercase font-fredoka  hover:text-sky-400"
              >
                Add
              </Link>
            </div>
          </div>
          <div className="bg-white shadow mt-10 rounded-lg">
            {project.collaborators?.length ? (
              project.collaborators?.map((collaborator) => (
                <Collaborator
                  key={collaborator._id}
                  collaborator={collaborator}
                />
              ))
            ) : (
              <p className="text-center my-5 p-10">
                There are no tasks in this project
              </p>
            )}
          </div>
        </>
      )}

      <ModalFormTask />
      <ModalDeleteTask />
      <ModalDeleteCollaborator />
    </>
  );
};

export default Project;
