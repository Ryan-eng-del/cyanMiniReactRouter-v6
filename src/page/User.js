import React from "react";
import { Outlet } from "../react-router";

export function User() {
  return (
    <div>
      user
      <Outlet />
    </div>
  );
}
