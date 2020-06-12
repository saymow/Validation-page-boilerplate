import React from "react";

import { useAuth } from "../../context/context";
import postManager from "../../services/mainCon";

import "./styles.css";

const Main = () => {
  const apiManager = new postManager();
  const { logOut } = useAuth();

  async function handleTest() {
    const response = await apiManager.teste();

    alert(response);
  }

  return (
    <div className="main-wrapper">
      <button onClick={handleTest}>Test connection</button>
      <button onClick={logOut}>Logout</button>
    </div>
  );
};

export default Main;
