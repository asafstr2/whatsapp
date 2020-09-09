import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "./axios";

const useStyles = makeStyles((theme) => ({
  root: {
    textDecoration: "none",
    color: "black",
  },

  SideBarChat: {
    display: "flex",
    padding: "20px",
    cursor: "pointer",
    borderBottom: "1px solid #f6f6f6",
  },
}));

function SideBarChat({ addNewChat, name, id }) {
  const [seed, setSeed] = useState(0);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);


  useEffect(() => {
    if(id)
    axios.get(`/rooms/${id}`).then((res) =>{ setMessages(res.data?.messages) } );
  }, [id,messages]);



  const classes = useStyles();
  let createNewChat = () => {
    const roomName = prompt("pleae enter chat room");
    if (roomName) {
      axios.post(`/newroom`, { name: roomName });
    }
  };
  return !addNewChat ? (
    <Link to={`/rooms/${id}`} className={classes.root}>
      <div className={classes.SideBarChat}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className={classes.SideBarChatInfo}>
          <h2>{name}</h2>
          <p>{messages[messages.length-1]?.message}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createNewChat} className={classes.SideBarChat}>
      <h2>Add new chat Room</h2>
    </div>
  );
}

export default SideBarChat;
