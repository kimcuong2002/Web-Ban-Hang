import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./assets/sass/index.scss";
import { Provider } from "react-redux";
import Store from "./redux";
import reportWebVitals from "./reportWebVitals";

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={Store}>
      <App />
    </Provider>
);

reportWebVitals();
