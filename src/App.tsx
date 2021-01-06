import React from "react";
import "./App.css";
import { Route, Switch, Router } from "react-router-dom";
import LoginScreen from "./features/login/LoginScreen";
import { createBrowserHistory } from "history";
import UploadIdentityCardScreen from "./features/uploadIdentityCard/Upload-Identity-Card-Screen";
import WebCam from "./features/webcam/webcam";
import FinishScreen from "./features/finish/finish-screen";

function App() {
  const history = createBrowserHistory();
  return (
    <Switch>
      <Router history={history}>
        <Route exact path="/" component={LoginScreen} />
        <Route
          path="/upload-identity-card"
          component={UploadIdentityCardScreen}
        />
        <Route path = '/capture-video' component = {WebCam}/>
        <Route path = '/finish' component = {FinishScreen}/>
      </Router>
    </Switch>
  );
}

export default App;
