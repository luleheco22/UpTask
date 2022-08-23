import { Link } from "react-router-dom"
import { useState } from "react"
import Alert from "../components/Alert"
import axiosClient from "../config/axiosClient"


const ForgetPassword = () => {

    const [email,setEmail]=useState('')
    const [alert,setAlert]=useState({})

    const handleSubmit= async e=>{
      const emailRegex = /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/ 
        e.preventDefault()
        if (!emailRegex.test(email)) {
            setAlert({
                msg:'Email is required',
                error:true
            })
            return
        }
        try {
            const {data}=await axiosClient.post(`/users/forget-password`,{
                email
            })
           setAlert({
            msg:data.msg,
            error:false
           })
        } catch (error) {
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
           
        }
    }

    const {msg}=alert

  return (
    <>
    <h1 className="text-sky-800 font-fredoka text-6xl capitalize">
    Regain your access and don't lose your   {""}
      <span className="text-slate-700">projects</span>{" "}
    </h1>
     {msg && <Alert alert={alert}/>}
    <form 
    className="my-10 bg-white shadow rounded-lg p-10 bg-gradient-to-r from-color1 to-color2"
    onSubmit={handleSubmit}
    >
     
      <div className="my-5">
        <label
          className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
          htmlFor="email"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Registration Email"
          className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
          value={email}
          onChange={e=>setEmail(e.target.value)}
       />
      </div>
     

      <input
        type="submit"
        value="Send Instructions"
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
          to="/register"
          className=" font-lato block text-center my-5 text-slate-500 uppercase text-sm"
        >
          You do not have an account? Sign up
        </Link>
    </nav>
  </>
  )
}

export default ForgetPassword