import React from "react";
import ReactDOM from "react-dom";
import "assets/style/index.css";
import App from "./App";
import { Auth0Provider } from "./components/common/ReactAuth0SPA";
import History from "utils/History";

const onRedirectCallback = (appState) => {
  History.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};

// AUTH0 details from the .env file
ReactDOM.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH0_DOMAIN}
    client_id={process.env.REACT_APP_AUTH0_CLIENTID}
    redirect_uri={window.location.origin}
    audience={process.env.REACT_APP_AUTH0_AUDIENCE}
    onRedirectCallback={onRedirectCallback}
  >
    <App />
  </Auth0Provider>,
  document.getElementById("root")
);
