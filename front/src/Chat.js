import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, IconButton } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import AttachFile from "@material-ui/icons/AttachFile";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from "@material-ui/icons/Send";
import MicIcon from "@material-ui/icons/Mic";
import { useParams } from "react-router-dom";
import axios from "./axios";
import Pusher from "pusher-js";
const useStyles = makeStyles((theme) => ({
  chat: {
    flex: "0.65",
    display: "flex",
    flexDirection: "column",
  },
  chatHeader: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    borderBottom: "1px solid lightgray",
  },
  chatHeaderInfo: {
    flex: "1",
  },
  chatHeaderRight: {
    marginLeft: "auto",
  },
  chatBody: {
    flex: "1",
    backgroundImage:
      "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
    backgroundRepeat: "repeat",
    backgroundPosition: "center",
    padding: "30px",
    overflow: "auto",
  },
  chatMessage: {
    position: "relative",
    fontSize: "16px",
    padding: "10px",
    borderRadius: "10px",
    width: "fit-content",
    display: "flex",
    backgroundColor: "#ffffff",
    marginBottom: "4%",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "8%",
    },
  },
  reciver: {
    marginLeft: "auto",
    backgroundColor: "#dcf8c6",
  },

  chatName: {
    position: "absolute",
    top: "-15px",
    fontSize: "10px",
  },
  chatTimeStamp: {
    fontSize: "xx-small",
    marginLeft: "6px",
    alignSelf: "flex-end",
  },

  chatFooter: {
    display: "flex",
    alignItems: "center",
    height: "62px",
    borderTop: "1px solid lightgray",
  },
  chatFooterForm: {
    display: "flex",
    alignItems: "center",
    flex: "1",
  },
  chatFooterFormInput: {
    flex: "1",
    minHeight: "40px",
    borderRadius: "20px",
    border: "none",
    outline: "none",
    paddingLeft: "2%",
    fontSize: "18px",
  },
}));
function Chat() {
  const currentUserId = "asaf";
  const classes = useStyles(currentUserId === "asaf");
  const [seed, setSeed] = useState(0);
  const [input, setInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const { roomId } = useParams();
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  useEffect(() => {
    axios.get(`/rooms/${roomId}`).then((res) => {
      setMessages(res.data?.messages);
      setRoomName(res.data?.name);
    });
  }, [roomId]);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([]);
  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    var pusher = new Pusher("899744c36189f508077b", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("chats");
    if (messages)
      channel.bind("inserted", (data) => {
        setMessages([...messages, data]);
      });

    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [messages]);

  let hundleSubmit = (e) => {
    e.preventDefault();
    if (!roomName) {
      setMessages([{ message: "please select a room" }]);
      console.log("no room");

      return;
    }
    axios.post(`/createmessage/${roomId}`, {
      message: input,
      name: currentUserId,
      timestamp: new Date(),
    });
    setInput("");
  };
  return (
    <div className={classes.chat}>
      <div className={classes.chatHeader}>
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className={classes.chatHeaderInfo}>
          <h3>{roomName}</h3>
          <p>last seen: {messages[messages.length - 1]?.timestamp}</p>
        </div>
        <div className={classes.chatHeaderRight}>
          <IconButton size="small">
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.chatBody}>
        {messages?.map((message, i) => (
          <p 
            key={message._id}
            className={`${classes.chatMessage} ${
              message.name === currentUserId && classes.reciver
            }`}
          >
            <span className={`${classes.chatName}  `}> {message.name}</span>
            {message.message}
            <span className={classes.chatTimeStamp}>{message?.timestamp}</span>
          </p>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className={classes.chatFooter}>
        <IconButton>
          <InsertEmoticonIcon />
        </IconButton>

        <form onSubmit={hundleSubmit} className={classes.chatFooterForm}>
          <input
            type="text"
            className={classes.chatFooterFormInput}
            placeholder="Type a message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <IconButton type="submit">
            <SendIcon />
          </IconButton>
          <IconButton>
            <MicIcon />
          </IconButton>
        </form>
      </div>
    </div>
  );
}

export default Chat;
