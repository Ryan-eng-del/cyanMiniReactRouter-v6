import { createHashHistory, createBrowserHistory } from "history";
import React from "react";
import { Router } from "../react-router";

export function HashRouter({ children }) {
  let historyRef = React.useRef();
  if (!historyRef.current) historyRef.current = createHashHistory();
  let history = historyRef.current;
  // console.log(history);
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigatorType={state.action}
    />
  );
}

export function BrowserRouter({ children }) {
  let historyRef = React.useRef();
  if (!historyRef.current) historyRef.current = createBrowserHistory();
  let history = historyRef.current;
  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });

  React.useLayoutEffect(() => history.listen(setState), [history]);

  return (
    <Router
      children={children}
      location={state.location}
      navigator={history}
      navigatorType={state.action}
    />
  );
}
