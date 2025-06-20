import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import socket from "./socket.js";
export default function Message(){
    const [search,setSearch]=useState({
        inSearch:""
    });
    const handleSearch=(e)=>{   
        setSearch({
            inSearch:e.target.value
        });

    };

socket.emit("joinChat");
socket.on("messageReceived");

    return(
        <div className='outer-div-mes'>
            <div className='nav-mes'>
                <div className='upper-con-nav'>
                          <h2 style={{paddingLeft:'13px'}}><strong>Messages</strong></h2>
                </div>
                <div className='search-user'>
                    <div className='search'>
                        <input type="text" name="userSearch" value={search.inSearch} onChange={handleSearch} placeholder='Search users'/>
                    </div>
                    
                    <div className='icon-nav'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                    </div>
               
                </div>
                <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
                 <div className='chat-Bars'>
                        <h3>Hello</h3>
                </div>
            </div>
            <div className='mes-box'>
                Hello messages
            </div>
         </div>
           
       
    )
}