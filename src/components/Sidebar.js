import React from "react";
import { SidebarDate } from "./SidebarData";
import { useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    
    return <div className="Sidebar">
        <ul className="SidebarList">
            {SidebarDate.map((value,key) => {
                const isActive =window.location.pathname.startsWith(value.link);
                return(
                    <li 
                        key={key}
                        id={isActive ? "active" : ""} 
                        className="row" 
                        onClick={() =>{
                        navigate(value.link)
                    }}
                    >
                        <div id = "icon"> {value.icon}</div>
                        <div id = "title"> {value.title}</div>
                    </li>
                )
            })}
        </ul>
    </div>;
}

export default Sidebar;