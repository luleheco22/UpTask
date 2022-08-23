import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Alert from "../components/Alert";
import FormCollaborator from "../components/FormCollaborator";
import useProjects from "../hooks/useProjects";
import { BounceLoader } from "react-spinners";
const NewCollaborator = () => {
  const { getProject, project, loading,collaborator,addCollaborator,alert } = useProjects();
  const params = useParams();

  useEffect(() => {
    getProject(params.id);
  }, []);

  if (!project._id) return <Alert alert={alert}/>

  return (
    <>
      <h1 className="text-4xl font-fredoka">
        Add Collaborator to Project:{" "}
        <span className="text-sky-400">{project.name}</span>{" "}
      </h1>

      <div className="mt-10 flex justify-center">
        <FormCollaborator />
      </div>

      {loading? <BounceLoader className="mt-5 m-auto flex justify-center absolute top-1/2" size={100} loading color="#2600ff" />:collaborator?._id && (
            <div className="flex justify-center mt-10">
                <div className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">
                    <h2 className="text-center mb-10 text-2xl font-fredoka">Result:</h2>
               
                     <div className="flex justify-between items-center gap-4">
                        <p className="font-fredoka text-2xl">{collaborator.name}</p>

                        <button 
                        type="button"
                        className="bg-slate-500 px-5 py-2 rounded-lg uppercase
                        text-white font-fredoka hover:bg-green-400"
                        onClick={()=>addCollaborator({email:collaborator.email})}
                        >
                            Add to Project
                        </button>
                     </div>
                </div>
                
            </div>

      )}
    </>
  );
};

export default NewCollaborator;
