import Game from "board-state";

class CardPlayGame extends Game {
  static getFilters(state) {
    const filters = {};
    for (let playerID in state.hands) {
      filters[playerID] = s => {
        s.handCounts = {};
        for (let p in s.hands) {
          s.handCounts[p] = s.hands[p].length;
        }
        s.hands = { [playerID]: s.hands[playerID] };
      };
    }
    return filters;
  }
  static updateState(state, action) {
    this.applyUpdate(state, fs => {
      const pos = fs.hands[action.player].indexOf(action.value);
      fs.hands[action.player].splice(pos, 1);
    });
    state.total += action.value;
  }
  static getStartState() {
    return {
      total: 10,
      hands: { a: [2, 3, 7], b: [4, 5, 6], c: [9, 10] }
    };
  }
  static suggestActions(state) {
    const result = [];
    for (const player in state.hands) {
      result.push(
        ...state.hands[player].map(value => ({
          player,
          value
        }))
      );
    }
    return result;
  }
  static checkAction(state, action) {
    if (!action.player in state.hands) {
      throw new Error("Unknown player");
    }
    if (!action.value in state.hands[action.player]) {
      throw new Error("Player does not have that card");
    }
    return true;
  }
}

export default CardPlayGame;
