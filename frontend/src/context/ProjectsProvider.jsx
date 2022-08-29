import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/axiosClient";
import io from 'socket.io-client'
import useAuth from "../hooks/useAuth";

let socket
const ProjectsContext = createContext();

const ProjectsProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [project, setProject] = useState({});
  const [alert, setAlert] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalDeleteProject, setModalDeleteProject] = useState(false);
  const [modalFormTask, setModalFormTask] = useState(false);
  const [modalDeleteTask, setModalDeleteTask] = useState(false);
  const [modalDeleteCollaborator, setModalDeleteCollaborator] = useState(false);
  const [task, setTask] = useState({});
  const [collaborator, setCollaborator] = useState({});
  const [seeker, setSeeker] = useState(false);
  const navigate = useNavigate();

  const {auth}=useAuth()

  useEffect(() => {
    const getAllProjects = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };

        const { data } = await axiosClient("/projects", config);
        setProjects(data);
      } catch (error) {
        console.log(error);
      }
    };

    getAllProjects();
  }, [auth]);

 useEffect(() => {
     socket=io(import.meta.env.VITE_BACKEND_URL)
 }, [])



  const showAlert = (alert) => {
    setAlert(alert);

    setTimeout(() => {
      setAlert({});
    }, 5000);
  };

  const submitProject = async (project, id) => {
    if (id) {
      await editProject(project, id);
    } else {
      await newProject(project);
    }
  };

  const editProject = async (project, id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.put(
        `/projects/${id}`,
        project,
        config
      );

      const updatedProjects = projects.map((stateProject) =>
        stateProject._id === data._id ? data : stateProject
      );
      setProjects(updatedProjects);
      setAlert({
        msg: "Project updated  successfully",
        error: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const newProject = async (project) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post("/projects", project, config);
      setProjects([...projects, data]);
      setAlert({
        msg: "Project created successfully",
        error: false,
      });

      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const getProject = async (id) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient(`/projects/${id}`, config);

      setProject(data);
      setAlert({});
    } catch (error) {
      navigate("/projects");
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
      setTimeout(() => {
        setAlert({});
      }, 3000);
    }
    setLoading(false);
  };

  const handleModalDeleteProject = () => {
    setModalDeleteProject(!modalDeleteProject);
  };

  const handleModalTask = () => {
    setModalFormTask(!modalFormTask);
    setTask({});
  };

  const deleteProject = async (_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.delete(`/projects/${_id}`, config);

      const updatedProjects = projects.filter(
        (stateProject) => stateProject._id !== _id
      );
      setProjects(updatedProjects);
      setModalDeleteProject(false);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setTimeout(() => {
        setAlert({});
        navigate("/projects");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  const createTask = async (task) => {

    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post("/tasks", task, config);
      // const updatedProject = { ...project };
      // updatedProject.tasks = [...project.tasks, data];
      // setProject(updatedProject);
      setAlert({});
      setModalFormTask(false);

      //SOCKET IO
      socket.emit('new task',data)
    } catch (error) {
      console.log(error);
    }
  };

  const editTask = async (task) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.put(`/tasks/${task.id}`, task, config);
     
      
      setAlert({});
      setModalFormTask(false);
      
      //SOCKET
      socket.emit('update task',data)
      
    } catch (error) {
      console.log(error);
    }
  };

  const submitTask = async (task) => {
    if (task?.id) {
      await editTask(task);
    } else {
      await createTask(task);
    }
  };

  const handleModalEditTask = (task) => {
    setTask(task);
    setModalFormTask(true);
  };

  const handleModalDeleteTask = (task) => {
    console.log("entroo");
    setTask(task);
    setModalDeleteTask(!modalDeleteTask);
  };

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.delete(`/tasks/${task._id}`, config);
      setAlert({
        msg: data.msg,
        error: false,
      });
      // const updatedProject = { ...project };
      // updatedProject.tasks = updatedProject.tasks.filter(
      //   (stateTask) => stateTask._id !== task._id
      // );
      // setProject(updatedProject);
      setModalDeleteTask(false);
      
      //SOCKET
      socket.emit('delete task',task)

      setTask({});
      setTimeout(() => {
        setAlert({});
      }, 3000);
    } catch (error) {
      console.log(error);
    }
  };

  const submitCollaborator = async (email) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post(
        "/projects/collaborators",
        { email },
        config
      );

      setCollaborator(data);
      setAlert({});
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
    setLoading(false);
  };

  const addCollaborator = async (email) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axiosClient.post(
        `/projects/collaborators/${project._id}`,
        email,
        config
      );
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setTimeout(() => {
        setAlert({});
      }, 2000);
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }
  };

  const handleModalDeleteCollaborator = (collaborator) => {
    setModalDeleteCollaborator(!modalDeleteCollaborator);
    setCollaborator(collaborator);
  };

  const deleteCollaborator = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post(
        `/projects/delete-collaborator/${project._id}`,
        { id: collaborator._id },
        config
      );

      const updatedProject = { ...project };
      updatedProject.collaborators = updatedProject.collaborators.filter(
        (stateCollaborator) => stateCollaborator._id !== collaborator._id
      );
      setProject(updatedProject);
      setAlert({
        msg: data.msg,
        error: false,
      });
      setCollaborator({});
      setModalDeleteCollaborator(false);
      setTimeout(() => {
        setAlert({});
      }, 2000);
    } catch (error) {
      console.log(error.response);
    }
  };

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axiosClient.post(`/tasks/state/${id}`, {}, config);
    
      setTask({});
      setAlert({});

      //SOCKET
       socket.emit('change state',data)
    } catch (error) {
      console.log(error.response.data);
    }
  };

  const handleSeeker = () => {
    setSeeker(!seeker);
  };


  //SOCKET IO
  const submitTasksProject=(task)=>{
    console.log(task)
    const updatedProject = { ...project };
    updatedProject.tasks = [...updatedProject.tasks, task];
    setProject(updatedProject);
  }

  const deleteTaskProject=(task)=>{
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.filter(
      (stateTask) => stateTask._id !== task._id
    );
    setProject(updatedProject);
  }

  const updateTaskProject=(task)=>{
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((stateTask) =>
      stateTask._id === task._id ? task : stateTask
    );
    setProject(updatedProject);
  }

  const changeStateTaskProject=(task)=>{
    const updatedProject = { ...project };
    updatedProject.tasks = updatedProject.tasks.map((stateTask) =>
      stateTask._id === task._id ? task : stateTask
    );

    setProject(updatedProject);
  }

  const  signOffProjects=()=>{
    setProjects([])
    setProject({})
    setAlert({})
  }

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        showAlert,
        alert,
        submitProject,
        getProject,
        project,
        loading,
        modalFormTask,
        handleModalTask,
        deleteProject,
        submitTask,
        task,
        handleModalEditTask,
        modalDeleteTask,
        handleModalDeleteTask,
        deleteTask,
        modalDeleteProject,
        handleModalDeleteProject,
        submitCollaborator,
        collaborator,
        addCollaborator,
        modalDeleteCollaborator,
        handleModalDeleteCollaborator,
        deleteCollaborator,
        completeTask,
        seeker,
        handleSeeker,
        submitTasksProject,
        deleteTaskProject,
        updateTaskProject,
        changeStateTaskProject,
        signOffProjects
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
};

export { ProjectsProvider };

export default ProjectsContext;
