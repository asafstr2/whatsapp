import React,{useState,useEffect} from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SideBarChat from "./SideBarChat";
import axios from "./axios"
import Pusher from "pusher-js";
const useStyles = makeStyles((theme) => ({
  sideBar: {
    flexDirection: "column",
    flex: "0.35",
    overflow: "auto",
    backgroundColor: "white",
  },
  search: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f6f6f6",
    height: "39px",
    padding: "10px",
  },
  searchContainer: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "White",
    flex: "1",
    height: "95%",
    borderRadius: "20px",
    "& input": {
      border: "none",
      marginLeft: "10px",
    },
    "& .MuiSvgIcon-root": {
      color: "gray",
      padding: "10px",
    },
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    padding: "20px",
    borderRight: "1px solid lightgray",
  },
  sidebarHeaderRight: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginLeft: "auto",
    gap: "10px",
  },
  SideBarChat: {
    background: "white",
    flex: "1",
    "& :hover": {
      backgroundColor: "#ebebeb",
    },
  },
}));

function SideBar() {
  const [rooms, setRooms] = useState([]);
  const [roomsToShow, setRoomsToShow] = useState([]);
  useEffect(() => {
    axios.get(`/rooms`).then((res) => {setRooms(res.data); setRoomsToShow(res.data)} );

  }, []);


  useEffect(() => {
    
    var pusher = new Pusher("899744c36189f508077b", {
      cluster: "ap2",
    });
    const channel = pusher.subscribe("rooms");
    if(rooms){
    channel.bind("inserted", (data) => {
      setRooms([...rooms, data]);
      setRoomsToShow([...rooms, data])
    });
  }
    return () => {
      channel.unsubscribe();
      channel.unbind_all();
    };
  }, [rooms]);



  const classes = useStyles();
  const [search, setSearch] = useState("")
let hundleSearch=(e)=>{
  setSearch(e.target.value)
};
useEffect(() => {
  setRoomsToShow(rooms.filter((room)=> room.name.includes(search)))
},[search,rooms])
  return (
    <div className={classes.sideBar}>
      <div className={classes.sidebarHeader}>
        <Avatar className={classes.avatar} />
        <div className={classes.sidebarHeaderRight}>
          <IconButton size="small">
            <DonutLargeIcon />
          </IconButton>
          <IconButton size="small">
            <ChatIcon />
          </IconButton>
          <IconButton size="small">
            <MoreVertIcon />
          </IconButton>
        </div>
      </div>
      <div className={classes.search}>
        <div className={classes.searchContainer}>
          <SearchOutlinedIcon />
          <input placeholder="search or start new chat" type="text"  value={search} onChange={hundleSearch}/>
        </div>
      </div>
      <div className={classes.SideBarChat}>
        <SideBarChat addNewChat />
        {roomsToShow?.map(room=><SideBarChat key={room?._id} id={room?._id} name={room?.name}/>)}
      </div>
    </div>
  );
}

export default SideBar;
