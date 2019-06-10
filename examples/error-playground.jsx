import React from "react";
import ReactDOM from "react-dom";

import BadGame from "./error";

import PlaygroundApp from "..";

ReactDOM.render(
  <>
    <PlaygroundApp
      gameClass={BadGame}
      initialState={{ secret: 5, public: 7 }}
      filterKeys={["default"]}
    />
  </>,
  document.getElementById("react-render-target")
);
