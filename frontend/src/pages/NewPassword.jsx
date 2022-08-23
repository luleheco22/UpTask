import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Alert from "../components/Alert";
import axiosClient from "../config/axiosClient";

const NewPassword = () => {
  const [validToken, setValidToken] = useState(false);
  const [alert, setAlert] = useState({});
  const [password,setPassword]=useState('')
  const [modifiedPassword,setModifiedPassword]=useState('')

  const params = useParams();
  const { token } = params;

  useEffect(() => {
    const checkToken = async () => {
      try {
        await axiosClient(`/users/forget-password/${token}`);
        setValidToken(true);
      } catch (error) {
        setAlert({
          msg: error.response.data.msg,
          error: true,
        });
      }
    };
    checkToken();
  }, []);

  const handleSubmit=async(e)=>{
      e.preventDefault()
      if (password.length<6) {
        setAlert({
          msg:'The password must have a minimum of 6 characters',
          error: true,
        })
        return
      }
      try {
        const url=`/users/forget-password/${token}`

        const {data}=await axiosClient.post(url,{
          password
        })
        setAlert({
          msg:data.msg,
          error:false
        })
        setPassword('')
        setModifiedPassword(true)
        console.log(data)
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
        Reset your password and don't lose access to your {""}
        <span className="text-slate-700">projects</span>{" "}
      </h1>

      {msg && <Alert alert={alert}/>}

      {validToken && (
        <form
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10 bg-gradient-to-r from-color1 to-color2">
          <div className="my-5">
            <label
              className="uppercase block text-slate-700 text-xl font-fredoka font-bold"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Write your new Password"
              className="w-full mt-3 p-3 border rounded-xl bg-gray-50"
              value={password}
              onChange={e=>setPassword(e.target.value)}
           />
          </div>

          <input
            type="submit"
            value="Save New Password"
            className="bg-sky-700 w-full py-3 text-white uppercase font-fredoka font-bold rounded
           hover:cursor-pointer hover:bg-sky-800 transition-colors mb-5"
          />
        </form>
      )}
       {modifiedPassword && (
              <Link
              to="/"
              className="block text-center my-5 text-slate-500 uppercase text-sm"
            >
              Log in
            </Link>
        ) }
    </>
  );
};

export default NewPassword;
