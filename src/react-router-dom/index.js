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

  React.useEffect(() => {
    history.listen((state) => {
      console.log("listening");
      setState(state);
    });
  }, [history]);

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
  let navigate = useNavigate();
  let { to, children } = props;

  return <a onClick={() => navigate(to)}>{children}</a>;
}

/* 自己实现的 createBrowserHistory */
// function createBrowserHistory() {
//   const globalHistory = window.history;
//   let state = null;
//   let listeners = [];
//   function go(n) {
//     globalHistory.go(n);
//   }

//   function goForward() {
//     go(1);
//   }

//   function goBack() {
//     go(-1);
//   }

//   function push(pathname, nextState) {
//     if (typeof pathname === "object") {
//       state = pathname.state;
//       pathname = pathname.pathname;
//     } else {
//       state = nextState;
//     }
//     globalHistory.pushState(state, null, pathname);

//     let location = {
//       state: globalHistory.state,
//       pathname: window.location.pathname,
//     };

//     notify({ action: "PUSH", location });
//   }

//   /* 接受监听回调函数 */
//   function listen(listener) {
//     listeners.push(listener);
//     /* 返回清理监听函数 */
//     return () => {
//       listeners = listeners.filter((item) => item !== listener);
//     };
//   }

//   /* 监听notify */
//   function notify(newState) {
//     Object.assign(globalHistory, newState);
//     listeners.forEach((listener) =>
//       listener({ location: globalHistory.location })
//     );
//   }

//   window.addEventListener("popstate", () => {
//     let location = {
//       state: globalHistory.state,
//       pathname: window.location.pathname,
//     };
//     notify({ action: "POP", location });
//   });

//   return {
//     action: "POP",
//     push,
//     go,
//     goForward,
//     goBack,
//     listen,
//     location: {
//       pathname: window.location.pathname,
//       state: window.history.state,
//     },
//   };
// }
