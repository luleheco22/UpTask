import React from "react";
import { formatDate } from "../helpers/formatDate";
import useAdmin from "../hooks/useAdmin";
import useProjects from "../hooks/useProjects";

const Task = ({ task }) => {
  const { handleModalEditTask, handleModalDeleteTask, completeTask } =
    useProjects();

  const admin = useAdmin();

  const { _id, name, description, priority, deliveryDate, state } = task;
 
  return (
    <div className="border-b p-5 flex justify-between items-center">
      <div className="flex flex-col items-start">
        <p className="mb-1 text-xl font-fredoka p-1">{name}</p>
        <p className="mb-1 text-sm text-gray-500 uppercase">{description}</p>
        <p className="mb-1 text-sm">{formatDate(deliveryDate)}</p>
        <p className="mb-1 text-gray-600">Priority: {priority==='High'?<span className="text-red-600">{priority}</span>: priority==='Medium'?<span className="text-yellow-600">{priority}</span>:<span className="text-indigo-600">{priority}</span>} </p>
        {state && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completed by: {task.complete.name} </p>}
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        {admin && (
          <button
            type="button"
            className="bg-yellow-500 hover:bg-yellow-600 transition-colors px-4 py-3 text-white
            uppercase font-fredoka text-sm rounded-lg"
            onClick={() => handleModalEditTask(task)}
          >
            Edit
          </button>
        )}

        <button
          type="button"
          className={`${
            state
              ? "bg-sky-500 hover:bg-sky-600 transition-colors"
              : "bg-gray-500 hover:bg-gray-600 transition-colors"
          } px-4 py-3 text-white
              uppercase font-fredoka text-sm rounded-lg`}
          onClick={() => completeTask(_id)}
        >
          {state ? "Complte" : "Incomplete"}
        </button>

        {admin && (
          <button
            type="button"
            className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-3 text-white
            uppercase font-fredoka text-sm rounded-lg"
            onClick={() => handleModalDeleteTask(task)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default Task;
