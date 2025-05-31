import React,{useState} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
export default function Message(){
    const [search,setSearch]=useState({
        inSearch:""
    });
    const handleSearch=(e)=>{   
        setSearch({
            inSearch:e.target.value
        });

    };
    return(
        <div className='outer-div-mes'>
            <div className='nav-mes'>
                <div className='upper-con-nav'>
                          <h2 style={{paddingLeft:'13px'}}><strong>Messages</strong></h2>
                </div>
                <div className='search-user'>
                    <div className='search' style={{paddingLeft:'12px'}}>
                        <input type="text" name="userSearch" value={search.inSearch} style={{width:"139%"}} onChange={handleSearch} placeholder='Search users'/>
                    </div>
                    
                    <div className='icon-nav'>
                        <FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize:'27px',paddingLeft:'160px'}} />
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
            </div>
            <div className='mes-box'>
                Hello messages
            </div>
         </div>
           
       
    )
}