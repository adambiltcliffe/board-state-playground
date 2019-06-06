import React from "react";
import ReactDOM from "react-dom";

import AddingGame from "./adding";

import PlaygroundApp from "..";

ReactDOM.render(
  <>
    <PlaygroundApp gameClass={AddingGame} initialState={{}}/>
  </>,
  document.getElementById("react-render-target")
);
