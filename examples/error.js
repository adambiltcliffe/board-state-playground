import Game from "board-state";

class BadGame extends Game {
  static getFilters() {
    return {
      default: state => {
        {
          delete state.secret;
        }
      }
    };
  }
  static updateState(state, action) {
    if (action.type == "good") {
      state.public++;
    } else if (action.type == "bad") {
      state.secret++;
    }
  }
  static checkAction(state, action) {
    if (action.type != "good" && action.type != "bad") {
      throw new Error("Illegal action type");
    }
    return true;
  }
  static suggestActions(state) {
    return [{ type: "good" }, { type: "bad" }];
  }
}

export default BadGame;
