import React, { useCallback, useState } from "react";
import niceStringify from "json-stringify-pretty-compact"

const PlaygroundApp = ({ gameClass, initialState }) => {
  const [currentState, setCurrentState] = useState(initialState);
  const [newAction, setNewAction] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [validation, setValidation] = useState("Enter action");

  const handleActionChange = useCallback(e => {
    setNewAction(e.target.value);
    validate(e.target.value);
  });

  const validate = useCallback((actionText) => {
    try {
      const actionObject = JSON.parse(actionText);
      try {gameClass.checkAction(currentState, actionObject)
        setAllowSubmit(true);
        setValidation("Ok!");
      } catch(e) {
        setAllowSubmit(false);
        setValidation("Not a legal action --- " + e);
      }
    } catch (e) {
      setValidation("Could not parse JSON --- " + e);
      setAllowSubmit(false);
    }
  });

  const handleSubmit = useCallback(e => {
    e.preventDefault();
    if (!allowSubmit) {
      return;
    }
    const actionObject = JSON.parse(newAction);
    const newState = gameClass.playAction(currentState, actionObject).state
    setCurrentState(newState);
    setNewAction("")
  });

  const actionList = gameClass.suggestActions(currentState).map(a => {
    const s = JSON.stringify(a);
    return <option value={s} key={s} />
  })

  const actionForm = (
    <form onSubmit={handleSubmit}>
      <input type="text" list="actions" value={newAction} onChange={handleActionChange} />
      <datalist id="actions">{actionList}</datalist>
      <button type="submit" disabled={!allowSubmit}>
        Apply
      </button>
      <span>{validation}</span>
    </form>
  );

  return (
    <>
      <h3>Full view</h3>
      <pre>
        <code>{niceStringify(currentState, null, 2)}</code>
      </pre>
      {actionForm}
    </>
  );
};

export default PlaygroundApp;
