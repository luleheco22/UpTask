import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useProjects from "../hooks/useProjects";
import Alert from "./Alert";

const FormProject = () => {
  const { alert, showAlert, submitProject, project } = useProjects();
  const [data, setData] = useState({
    name: "",
    description: "",
    deliverDate: "",
    client: "",
  });
  const [id,setId]=useState(null)

  const params = useParams();

  useEffect(() => {
    if (params.id) {
        setId(project._id)
      setData({
        name: project.name,
        description: project.description,
        deliverDate: project.deliverDate?.split("T")[0],
        client: project.client,
      });
    } else {
    }
  }, [params]);

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(data).includes("")) {
      showAlert({
        msg: "All fields are required",
        error: true,
      });
      return;
    }

    await submitProject(data,id);
    setData({
      name: "",
      description: "",
      deliverDate: "",
      client: "",
    });
    setId(null)
  };

  const { msg } = alert;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white py-10 px-5 md:w-1/2 rounded-lg"
    >
      {msg && <Alert alert={alert} />}
      <div className="mb-5">
        <label
          htmlFor="name"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Name Project
        </label>

        <input
          id="name"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Name Project"
          value={data.name}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="description"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Description
        </label>

        <textarea
          id="description"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Description Project"
          value={data.description}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="deliverDate"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Date of Delivery
        </label>

        <input
          id="deliverDate"
          type="date"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          value={data.deliverDate}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <label
          htmlFor="client"
          className="text-gray-700 uppercase font-bold text-sm"
        >
          Name Client
        </label>

        <input
          id="client"
          type="text"
          className="border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md"
          placeholder="Name Client"
          value={data.client}
          onChange={handleInputChange}
        />
      </div>
      <input
        type="submit"
        value={id? 'Update Project': 'Create Project'}
        className="bg-sky-600 w-full p-3 uppercase font-bold rounded cursor-pointer font-fredoka
       hover:bg-sky-700 transition-colors text-white"
      />
    </form>
  );
};

export default FormProject;
