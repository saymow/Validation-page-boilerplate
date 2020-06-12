import React, { useContext, useState, createContext, useEffect } from "react";

import { SingInCon, SignUpCon, VerifyToken } from "../services/authCon";

const authContext = createContext({});

export function AppContext({ children }) {
  const [userName, setUserName] = useState(false);

  function authorify(response) {
    localStorage.setItem("@Auth:token", response.token);
    localStorage.setItem("@Auth:user", JSON.stringify(response.userData));
    setUserName(response.userData.user);
  }

  async function signIn(data) {
    const response = await SingInCon(data);

    if (response["error"]) return response;

    authorify(response);
  }

  async function signUp(data) {
    const response = await SignUpCon(data);

    return response;
  }

  function logOut() {
    localStorage.clear();
    setUserName(false);
  }

  useEffect(() => {
    async function authToken() {
      let token = localStorage.getItem("@Auth:token");
      let user = localStorage.getItem("@Auth:user");

      if (token && user) {
        let userData = JSON.parse(user);

        setUserName(userData.user);

        let response = await VerifyToken(`Bearer ${token}`);

        if (response !== "success") {
          localStorage.clear();
          setUserName(false);
        }
      }
    }

    authToken();
  }, []);

  return (
    <authContext.Provider
      value={{ loggedIn: Boolean(userName), userName, signIn, signUp, logOut }}
    >
      {children}
    </authContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(authContext);

  return context;
}
