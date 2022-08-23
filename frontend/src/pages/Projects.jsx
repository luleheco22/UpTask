import Alert from "../components/Alert";
import PreviewProject from "../components/PreviewProject";
import useProjects from "../hooks/useProjects";
import { useEffect } from "react";



const Projects = () => {
  const { projects,alert } = useProjects();




  const {msg}=alert
  return (
    <>
      <h1 className="text-4xl font-black font-fredoka ">Projects</h1>
       {msg && <Alert alert={alert}/>}
      <div className="bg-white shadow mt-10 rounded-lg ">
        {projects.length ? (
          projects.map((p) => <PreviewProject key={p._id} project={p} />)
        ) : (
          <p className=" text-center text-gray-600 p-5 font-fredoka">
            There is no project
          </p>
        )}
      </div>
    </>
  );
};

export default Projects;
