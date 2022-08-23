import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useProjects from "../hooks/useProjects";
import Search from "./Search";

const Header = () => {

 const {handleSeeker,signOffProjects}=useProjects()
 const {signOffAuth}=useAuth()

 const handleSignOff=()=>{
  signOffProjects()
  signOffAuth()
  localStorage.removeItem('token')
 }

  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
        <h2 className="text-4xl text-sky-600 font-fredoka font-black text-center mb-5 md:mb-0">
          UpTask
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-4">
          <button 
          type="button"
          className="font-fredoka uppercase"
          onClick={handleSeeker}
          >Search Project</button>

          <Link to="/projects" className="font-bold font-fredoka uppercase">
            Projects
          </Link>

          <button
            type="button"
            className="text-white text-sm bg-sky-600 p-3 rounded-md uppercase font-bold font-fredoka"
           onClick={handleSignOff}
          >
            Sign off
          </button>
        </div>
      </div>
      <Search/>
    </header>
  );
};

export default Header;
