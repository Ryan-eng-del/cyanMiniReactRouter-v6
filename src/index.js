import React from "react";
import ReactDOM from "react-dom/client";
import { Home } from "./page/Home";
import { Profile } from "./page/Profile";
import { User } from "./page/User";
import { Routes, Route } from "./react-router";

import { HashRouter } from "./react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <HashRouter>
    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/user" element={<User />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  </HashRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
