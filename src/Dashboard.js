import React,{useState} from "react";
import { useNavigate } from "react-router-dom";
export default function Dashboard(){
    const navigate=useNavigate();
    const [isCollapsed,setIsCollapsed]=useState(false);
    return (
        <div>
            <button className="toggle-btn" onClick={()=>setIsCollapsed(!isCollapsed)}>
                {isCollapsed ? "☰" : "✖"}
            </button>
            <div className="menu-items">
                <h5 onClick={()=>navigate("/dashboard")}>Dashboard</h5>
                <h5 onClick={()=>navigate("/")}>User Management</h5>
                <h5 onClick={()=>navigate("/")}>Applications</h5>
                <h5 onClick={()=>navigate("/")}>Analytics</h5>
                <h5 onClick={()=>navigate("/")}>Settings   </h5>

            </div>
        </div>
    )
};