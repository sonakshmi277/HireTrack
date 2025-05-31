import React from "react";
import "./common.css";
import {useNavigate} from 'react-router-dom';
export default function Frontpg() {
    const navigate=useNavigate();
    const goToSignIn=()=>{
        navigate("/Signin");
    };

  return (
        <div className="main">
            <div className="quote">
                <h1>Stay on top of your job applications — all in one place</h1>
                <h3>Track, manage, and automate your job search with ease.</h3>
            </div>
            <div className="inup">
                <button className="inn" onClick={goToSignIn}>Sign In</button>
                <button className="upp">Sign Up</button>

            </div>
        </div>
  );
}
