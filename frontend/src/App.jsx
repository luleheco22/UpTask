import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { ProjectsProvider } from "./context/ProjectsProvider";
import AuthLayout from "./layouts/AuthLayout";
import ProtectedRoute from "./layouts/ProtectedRoute";
import ConfirmAccount from "./pages/ConfirmAccount";
import EditProject from "./pages/EditProject";
import ForgetPassword from "./pages/ForgetPassword";
import Login from "./pages/Login";
import NewCollaborator from "./pages/NewCollaborator";
import NewPassword from "./pages/NewPassword";
import NewProject from "./pages/NewProject";
import Project from "./pages/Project";
import Projects from "./pages/Projects";
import Register from "./pages/Register";
import.meta.env.VITE_BACKEND_URL;

function App() {
  return (
    <AuthProvider>
      <ProjectsProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forget-password" element={<ForgetPassword />} />
            <Route path="forget-password/:token" element={<NewPassword />} />
            <Route path="confirm/:id" element={<ConfirmAccount />} />
          </Route>

          <Route path="/projects" element={<ProtectedRoute />}>
            <Route index element={<Projects />} />
            <Route path="create-project" element={<NewProject />} />
            <Route path="new-collaborator/:id" element={<NewCollaborator/>} />
            <Route path=":id" element={<Project/>} />
            <Route path=":edit/:id" element={<EditProject/>} />
          </Route>
        </Routes>
      </ProjectsProvider>
    </AuthProvider>
  );
}

export default App;
