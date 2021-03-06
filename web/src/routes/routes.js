import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Main from "../pages/main";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={Main} path="/" exact />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
