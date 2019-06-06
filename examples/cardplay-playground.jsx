import React from "react";
import ReactDOM from "react-dom";

import CardPlayGame from "./cardplay";

import PlaygroundApp from "..";

ReactDOM.render(
  <>
    <PlaygroundApp gameClass={CardPlayGame} initialState={CardPlayGame.getStartState()} />
  </>,
  document.getElementById("react-render-target")
);
