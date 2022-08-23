import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const ConfirmAccount = () => {

    const [alert,setAlert]=useState({})
    const [confirmedAccount,setConfirmedAccount]=useState(false)
    const params=useParams()
    const {id}=params

    useEffect(() => {
       const confirmAccount= async ()=>{
           try {
            const url= `/users/confirm/${id}`
            const {data}=await axiosClient(url)
            setTimeout(() => {
              setAlert({
                msg:data.msg,
                error:false
            })
            }, 2000);
            setConfirmedAccount(true)
         
           } catch (error) {
         
            setAlert({
                msg:error.response.data.msg,
                error:true
            })
           }
       }
       confirmAccount()
       setAlert({})
    
    }, [])

    const {msg}=alert

  return (
    <>
      <h1 className="text-sky-800 font-fredoka text-6xl capitalize">
        Confirm your account and start creating your {""}
        <span className="text-slate-700">projects</span>{" "}
      </h1>
      <div className="mt-20 md:mt-5 shadow-lg px-5 py-10 rounded-xl bg-white">
        {msg && <Alert alert={alert}/>}

        {confirmedAccount && (
              <Link
              to="/"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
            >
              Log in
            </Link>
        ) }
      </div>
    </>
  );
};

export default ConfirmAccount;
