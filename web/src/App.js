import React from "react";
import "./App.css";

import { AppContext } from "./context/context";
import RouterManager from "./routes/routeManager";

function App() {
  return (
    <AppContext>
      <RouterManager />
    </AppContext>
  );
}

export default App;
