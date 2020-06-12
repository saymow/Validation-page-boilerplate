import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import { useAuth } from "../context/context";
import AuthPages from "../pages/auth/authPages";
import Routes from "./routes";

const RouteManager = () => {
  const { loggedIn } = useAuth();

  if (!loggedIn)
    return (
      <BrowserRouter>
        <Route path="/" component={AuthPages} />
      </BrowserRouter>
    );

  return <Routes />;
};

export default RouteManager;
