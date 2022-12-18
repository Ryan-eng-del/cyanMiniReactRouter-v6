function createHashHistory() {
  const globalHistory = window.history;
  let state = null;
  let listeners = [];
  function go(n) {
    globalHistory.go(n);
  }

  function goForward() {
    go(1);
  }

  function goBack() {
    go(-1);
  }

  function push(pathname, nextState) {
    if (typeof pathname === "object") {
      state = pathname.state;
      pathname = pathname.pathname;
    } else {
      state = nextState;
    }

    globalHistory.pushState(state, null, pathname);
  }

  /* 接受监听回调函数 */
  function listen(listener) {
    listeners.push(listener);
    /* 返回清理监听函数 */
    return () => {
      listeners = listeners.filter((item) => item !== listener);
    };
  }

  /* 监听notify */
  function notify(newState) {
    Object.assign(globalHistory, newState);
    listeners.forEach((listener) =>
      listener({ location: globalHistory.location })
    );
  }

  window.addEventListener("popstate", () => {
    let location = {
      state: globalHistory.state,
      pathname: window.location.pathname,
    };
    notify({ action: "POP", location });
  });

  return {
    action: "POP",
    push,
    go,
    goForward,
    goBack,
    listen,
    location: {
      pathname: window.location.pathname,
      state: window.history.state,
    },
  };
}
