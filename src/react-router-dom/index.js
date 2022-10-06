import { createHashHistory, createBrowserHistory } from "history";
import React from "react";
import { NavigatorContext, Router } from "../react-router";

export function HashRouter({ children }) {
  let historyRef = React.useRef();

  if (!historyRef.current) historyRef.current = createHashHistory();
  let history = historyRef.current;

  let [state, setState] = React.useState({
    action: history.action,
    location: history.location,
  });
  // console.log(state, "state");
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

export function useNavigate() {
  const { navigator } = React.useContext(NavigatorContext);
  // debugger;
  const navigate = React.useCallback(
    (to) => {
      navigator.push(to);
    },
    [navigator]
  );
  return navigate;
}

export function Link(props) {
  // console.log(props, "props");
  // debugger;
  let navigate = useNavigate();
  let { to, children } = props;

  return <a onClick={() => navigate(to)}>{children}</a>;
}
