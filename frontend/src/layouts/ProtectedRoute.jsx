import { Outlet, Navigate } from "react-router-dom"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import useAuth from "../hooks/useAuth"
import {BounceLoader} from 'react-spinners'


const ProtectedRoute = () => {

    const {auth,loading}=useAuth()
  

    if (loading) return <BounceLoader color="#2600ff" className="m-auto flex justify-center absolute top-1/2" size={100} loading /> 
 
  return (
   <>
    {auth._id ? (
        <div className="bg-gray-100">
            
            <Header/>
            <div className="md:flex md:min-h-screen">
                <Sidebar/>

                <main className="flex-1 p-10">
                <Outlet/>
                </main>
            </div>
        </div>
    ):<Navigate to='/'/>}

   </>
  )
}

export default ProtectedRoute
