import Game from "board-state";

class AddingGame extends Game {
  static updateState(state, action) {
    if (action.type == "start") {
      return { total: 0 };
    } else if (action.type == "add") {
      state.total += action.amount;
    }
  }
  static isLegalAction(state, action) {
    try {
      this.checkAction(state, action);
      return true;
    } catch (e) {
      return false;
    }
  }
  static checkAction(state, action) {
    console.log(action);
    if (typeof action != "object") {
      throw new Error("Action is not an object");
    }
    switch (action.type) {
      case "start":
        if (JSON.stringify(state) == "{}") {
          return true;
        } else throw new Error("Tried to start from non-empty state");
      case "add":
        if (state.total == undefined) {
          throw new Error("Game not started yet");
        }
        if (!Number.isInteger(action.amount)) {
          throw new Error("Amount to add was not an integer");
        }
        if (action.amount <= 0) {
          throw new Error("Amount to add was not positive");
        }
        return true;
      default:
        throw new Error("Unrecognised action type");
    }
  }
  static suggestActions(state) {
    return [
      { type: "start" },
      { type: "add", amount: 1 },
      { type: "add", amount: 5 }
    ].filter(a => this.isLegalAction(state, a));
  }
}

export default AddingGame;
