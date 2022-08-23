import useProjects from "../hooks/useProjects";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import FormProject from "../components/FormProject";
import ModalDeleteProject from "../components/ModalDeleteProject";
import { BounceLoader } from "react-spinners";

const EditProject = () => {
  const params = useParams();
  const { id } = params;
 

  const { getProject, project, loading, handleModalDeleteProject } =
    useProjects();

  useEffect(() => {
    getProject(id);
  }, []);


  const { name,_id } = project;

  return loading ? (
    <BounceLoader className="m-auto flex justify-center absolute top-1/2" size={100} loading color="#2600ff" />
  ) : (
    <>
      <div className="flex justify-between">
        <h1 className="font-black font-fredoka text-4xl">
          Edit Project: {name}
        </h1>
        <div className="flex items-center gap-0 text-gray-400 hover:text-red-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <button
            className="uppercase font-bold font-fredoka"
            onClick={() => handleModalDeleteProject()}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <FormProject />
      </div>

    <ModalDeleteProject _id={_id}/>
  
    </>
  );
};

export default EditProject;
