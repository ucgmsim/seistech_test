import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "components/PrivateRoute";
import Loading from "components/common/Loading";
import NavBar from "components/NavBar/NavBar";

import Hazard from "views/Hazard";
import Profile from "views/Profile";
import Footer from "views/Footer";

import History from "utils/History";
import { GlobalContextProvider } from "context";
import { useAuth0 } from "./components/common/ReactAuth0SPA";

import "assets/style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// fontawesome
import InitFontAwesome from "utils/InitFontAwesome";
import Home from "views/Home";

InitFontAwesome();

const App = () => {
  const { loading } = useAuth0();

  if (loading) {
    return <Loading />;
  }

  return (
    <GlobalContextProvider>
      <Router history={History}>
        <div id="app" className="d-flex flex-column h-100">
          <NavBar />
          <div className="container-fluid main-body">
            <div className="row justify-content-center">
              <Switch>
                <Route path="/" exact component={Home} />

                <PrivateRoute path="/hazard" exact component={Hazard} />

                <PrivateRoute path="/profile" component={Profile} />
              </Switch>
            </div>
          </div>
        </div>
      </Router>
      <Footer />
    </GlobalContextProvider>
  );
};

export default App;
