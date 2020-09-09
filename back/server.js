import express from "express";
const app = express();
import cors from "cors";
import bodyParser from "body-parser";
import Chat from "./models/dbmesseges.js";
import Room from "./models/dbrooms.js";
import mongoose from "mongoose";
import Pusher  from "pusher"
const pusher = new Pusher({
  appId: '1067752',
  key: '899744c36189f508077b',
  secret: '1774074ab9773f9a8bf4',
  cluster: 'ap2',
  encrypted: true
});

//debug mode enabled
mongoose.set("debug", false);
//using es2016 promise with mongoose insure we can use async and  promises
mongoose.Promise = Promise;
//connection string to local DB with collection "lokali"
mongoose.connect(
  process.env.CONNECTION_STRING || "mongodb+srv://asafstr2:300753316qa@cluster0-x6hgc.azure.mongodb.net/whatsapp?retryWrites=true&w=majority",
  {
    keepAlive: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

const PORT = 8082;
//using cors to allow cross origin from diffrent port for front end to connect
//todo secure cors allow only front end
app.use(cors());
//using body parser json to send a json type req since it is api
app.use(bodyParser.json());

// ------------------------------------------pusher section----------------------------------------------------
const db = mongoose.connection;
db.once("open", () => {
  console.log("DB conected");
  try {
  const msgCollection = db.collection("chats");
  const changeStream = msgCollection.watch();
  const roomsCollection = db.collection("rooms");
  const changeStreamRoom = roomsCollection.watch();
    changeStream.on("change", (change) => {
      console.log("change occure", change);
      if (change.operationType === "insert") {
        const messageDetails = change.fullDocument;
        pusher.trigger("chats", "inserted", {
          name: messageDetails.name,
          message: messageDetails.message,
          timestamp: messageDetails.timestamp,
          recived: messageDetails.recived,
        });
      }
      else{
        console.log("error with pusher")
      }
    });
    changeStreamRoom.on("change", (change) => {
      console.log("change occure", change);
      if (change.operationType === "insert") {
        const messageDetails = change.fullDocument;
        pusher.trigger("rooms", "inserted", {
          name: messageDetails.name,
          _id:messageDetails._id
        });
      }
      else{
        console.log("error with pusher")
      }
    });
  } catch (error) {
    console.log(error)
  }


});

// ------------------------------------------routes section----------------------------------------------------

app.get("/rooms", async(req, res) => {
  console.log("get")
  try {
    let foundRoom = await Room.find()
    .populate("messages", {
      message: true,
      timestamp: true,
      name: true,
    });
    return res.status(200).json(foundRoom);
  } catch (error) {
    console.log(error);
  }
});

app.post("/new", (req, res) => {
  const dbMesseges = req.body;
  try {
    Chat.create(dbMesseges, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    });
  } catch (error) {
    console.log(error);
  }
});
// ------------------------------------------room route section----------------------------------------------------

app.get("/rooms/:roomid", async(req, res) => {
  
  try {
    let foundRoom = await Room.findById(req.params.roomid)
    .populate("messages", {
      message: true,
      timestamp: true,
      name: true,
    });
    return res.status(200).json(foundRoom);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/newroom", (req, res) => {
  try {
    let room =new Room({name:req.body.name})
    room.save((err) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("ok");
      }
    });
  } catch (error) {
    console.log(error);
  }
});

app.post( "/createmessage/:roomid" , async(req, res) => {
  console.log(req.params.roomid)
  try {
    let message = await Chat.create({
      ...req.body,
      roomId: req.params.roomid,
    });
    let foundRoom = await Room.findById(req.params.roomid);
    foundRoom.messages.push(message.id);
    await foundRoom.save();

    let foundMessege = await Chat.findById(message._id)
    // returnnig foundMessege so we can easily display the user with photo and the messege
    return res.status(200).json(foundMessege);
  } catch (err) {
    console.log(err);
  }
})



app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
