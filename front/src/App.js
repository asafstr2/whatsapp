import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import SideBar from "./SideBar";
import Chat from "./Chat.js";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  app: {
    backgroundColor: "#dadbd3",
    height: "100vh",
    width: "100vw",
    display: "grid",
    placeItems: "center",
  },
  app_body: {
    display: "flex",
    backgroundColor: "#ededed",
    height: "95%",
    maxHeight: "750px",
    width: "70%",
    boxShadow: "-1px 4px 20px -6px rgba(0,0,0,0.7)",
  },
  SideBar: {
    width: "100%",
    height: "100%",
    display: "flex",
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.app}>
      <div className={classes.app_body}>
        <div className={classes.SideBar}>
          <Router>
            <SideBar />
            <Switch>
              <Route path="/rooms/:roomId">
                <Chat />
              </Route>
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
