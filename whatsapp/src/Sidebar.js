import React from 'react'

import "./Sidebar.css"

import SearchIcon from '@material-ui/icons/Search';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import {Avatar,IconButton} from '@material-ui/core'
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {SearchOutlined} from "@material-ui/icons"
import SidebarChat from "./SidebarChat"



function Sidebar() {
    return (
        <div className="sidebar">
            <div className="sidebar_header">
                <Avatar src="https://lh3.googleusercontent.com/VHB9bVB8cTcnqwnu0nJqKYbiutRclnbGxTpwnayKB4vMxZj8pk1220Rg-6oQ68DwAkqO"/>
                <div className="sidebar_headerRight">
              <IconButton>
                <DonutLargeIcon/>
              </IconButton>
              <IconButton>
                <ChatIcon/>
              </IconButton>
              <IconButton>
                <MoreVertIcon/>
              </IconButton>
               
                </div>

            </div>
            <div className="sidebar_search">
            <div className="sidebar_searchContainer">
              <SearchOutlined/>
              <input placeholder="Search or start new chat" type="text"/>
            </div>
            </div>

            <div className="side_chats">
             <SidebarChat/>
             <SidebarChat/>
             <SidebarChat/>

            </div>
        </div>
    )
}

export default Sidebar
