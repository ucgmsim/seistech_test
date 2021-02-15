import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import PrivateRoute from "components/PrivateRoute";
import Loading from "components/common/Loading";
import NavBar from "components/NavBar/NavBar";

import Home from "views/Home";
import Hazard from "views/Hazard";
import Project from "views/Project";
import Profile from "views/Profile";
import Footer from "views/Footer";
import FrameworkDocView from "views/FrameworkDocView";
import EditUser from "views/EditUser";

import History from "utils/History";
import { GlobalContextProvider } from "context";
import { useAuth0 } from "./components/common/ReactAuth0SPA";

import "assets/style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";

// fontawesome
import InitFontAwesome from "utils/InitFontAwesome";

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

                <PrivateRoute path="/project" exact component={Project} />

                <PrivateRoute path="/edit-user" exact component={EditUser} />

                <PrivateRoute path="/profile" exact component={Profile} />

                <Route
                  path="/frameworks-doc"
                  exact
                  component={FrameworkDocView}
                />
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
