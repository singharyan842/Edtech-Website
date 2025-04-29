
import "./App.css";
import {Route, Routes} from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/common/Navbar";
import OpenRoute from "./components/core/Auth/OpenRoute"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import picture from '../src/assets/images/Photo.jpg'
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import VerifyEmail from "./pages/VerifyEmail";
import About from "./pages/About";


function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); 
  
  const { user } = useSelector((state) => state.profile)
  const [toastStatus, settoastStatus] = useState(true)
  
  if (toastStatus) {
      toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <img
                className="h-10 w-10 rounded-full"
                src={picture}
                alt=""
              />
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">
                Aryan Singh
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Backend server is using free hoisting service which may require 8-10 sec to warm-up initially,
                sorry for the inconvenience.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    ), {
      duration: 4000,
    })
    settoastStatus(false)
  }
  
  return (
    <div className="w-screen min-h-screen bg-richblack-900 flex-col font-inter">
      <Navbar />
      {/* Main content */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="forgot-password" element={<OpenRoute><ForgotPassword/></OpenRoute>}/>
            <Route path="signup" element={
              <OpenRoute>
                <Signup/>
              </OpenRoute>
            } />
            <Route path="login" element={
              <OpenRoute>
                <Login/>
              </OpenRoute>
            } />
            <Route
              path="verify-email"
              element={
                <OpenRoute>
                  <VerifyEmail />
                </OpenRoute>
              }
             />
             <Route
              path="update-password/:id"
              element={
                <OpenRoute>
                  <UpdatePassword />
                </OpenRoute>
              }
            /> 
            <Route path="about" element={<About />} />

            <Route path="dashboard" element={<Dashboard />}>
                <Route path="my-profile" element={<MyProfile />} />
                {/* add more dashboard child routes here */}
            </Route>
            
      </Routes>
    </div> 
  );
}

export default App;
