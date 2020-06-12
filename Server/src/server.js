const express = require("express");
const cors = require("cors");
const Routes = require("./routes");

const App = express();
App.use(cors());
App.use(express.json());
App.use(Routes);

App.listen(3333);
