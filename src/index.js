import React from "react";
import ReactDOM from "react-dom/client";
import { Home } from "./page/Home";
import { Post } from "./page/Post";
import { Profile } from "./page/Profile";
import { User } from "./page/User";
import { Routes, Route } from "./react-router";

import { BrowserRouter, Link } from "./react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <div>
      <ul>
        <li>
          <Link to={"/"}>首页</Link>
        </li>
        <li>
          <Link to={"/user"}>用户</Link>
        </li>
        <li>
          <Link to={"profile"}>详情</Link>
        </li>
      </ul>
    </div>

    <Routes>
      <Route path="/" element={<Home />}></Route>
      <Route path="/user" element={<User />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/post/:id" element={<Post />}></Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
