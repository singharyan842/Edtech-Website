import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import rootReducer from "./reducer";
import { configureStore } from "@reduxjs/toolkit";
import {Toaster} from "react-hot-toast";

const store = configureStore({
  reducer:rootReducer
})

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/*we wrap our App component with BrowserRouter because it helps us to use the routing features of React Router.*/}
    <Provider store={store}>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
      
    </Provider>
    
  </React.StrictMode>
);
