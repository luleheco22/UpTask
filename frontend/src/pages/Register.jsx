import { useState } from "react";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";


const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    repeatPassword: "",
  });
  const [alert, setAlert] = useState({});

  const handleInputChange = (e) => {
    setData({
      ...data,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(data).includes("")) {
      setAlert({
        msg: "All fields are required",
        error: true,
      });
      return;
    }
    if (data.password !== data.repeatPassword) {
      setAlert({
        msg: "Passwords are not the same",
        error: true,
      });
      return;
    }
    if (data.password.length < 6) {
      setAlert({
        msg: "The password must have a minimum of 6 characters",
        error: true,
      });
      return;
    }

    setAlert({});

    try {
      const { name, email, password } = data;
      const response = await axiosClient.post(`/users`, {
        name,
        email,
        password,
      });
      setAlert({
        msg: response.data.msg,
        error: false,
      });
      setData({
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
    })
    } catch (error) {
      setAlert({
        msg: error.response.data.msg,
        error: true,
      });
    }

   
  };

  const { msg } = alert;

  return (
    <>
      <h1 className="text-sky-800 font-fredoka text-6xl capitalize">
        Create your account and manage your {""}
        <span className="text-slate-700">projects</span>{" "}
      </h1>

      {msg && <Alert alert={alert} />}
      <form
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10 bg-gradient-to-r from-color1 to-color2"
      >
        <div className="my-5">
          <label
            className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
            htmlFor="name"
          >
            Name
          </label>
          <input
            id="name"
            value={data.name}
            type="text"
            placeholder="Your Name"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            onChange={handleInputChange}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            value={data.email}
            type="email"
            placeholder="Registration Email"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            onChange={handleInputChange}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            value={data.password}
            type="password"
            placeholder="Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            onChange={handleInputChange}
          />
        </div>
        <div className="my-5">
          <label
            className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
            htmlFor="password2"
          >
            Repeat Password
          </label>
          <input
            id="repeatPassword"
            value={data.repeatPassword}
            type="password"
            placeholder="Repeat your Password"
            className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
            onChange={handleInputChange}
          />
        </div>

        <input
          type="submit"
          value="Create Account"
          className="bg-sky-700 w-full py-3 text-white uppercase font-fredoka font-bold rounded
          hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          to="/"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          Do you already have an account? Log in
        </Link>
        <Link
          to="/forget-password"
          className="block text-center my-5 text-slate-500 uppercase text-sm"
        >
          I forgot my password
        </Link>
      </nav>
    </>
  );
};

export default Register;
