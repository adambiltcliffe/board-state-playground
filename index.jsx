import React, { useCallback, useState } from "react";
import niceStringify from "json-stringify-pretty-compact";
import produce from "immer";

const PlaygroundApp = ({ gameClass, initialState, filterKeys = [] }) => {
  const [history, setHistory] = useState(() => [
    {
      state: initialState,
      action: null,
      views: Object.assign(
        {},
        ...filterKeys.map(k => ({ [k]: gameClass.filter(initialState, k) }))
      ),
      newInfos: Object.assign({}, ...filterKeys.map(k => ({ [k]: null })))
    }
  ]);
  const [newAction, setNewAction] = useState("");
  const [allowSubmit, setAllowSubmit] = useState(false);
  const [validation, setValidation] = useState("Enter action");
  const [error, setError] = useState(null);

  const handleActionChange = useCallback(e => {
    setNewAction(e.target.value);
    validate(e.target.value);
  });

  const validate = useCallback(actionText => {
    try {
      const actionObject = JSON.parse(actionText);
      try {
        gameClass.checkAction(history[0].state, actionObject);
        setAllowSubmit(true);
        setValidation("Ok!");
      } catch (e) {
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
    try {
      const actionObject = JSON.parse(newAction);
      const { state, newInfos } = gameClass.playAction(
        history[0].state,
        actionObject
      );

      const step = {
        state,
        action: actionObject,
        views: Object.assign(
          {},
          ...filterKeys.map(k => ({
            [k]: gameClass.replayAction(
              history[0].views[k],
              actionObject,
              newInfos[k]
            )
          }))
        ),
        newInfos
      };
      const newHistory = produce(history, draft => {
        draft.unshift(step);
      });
      setHistory(newHistory);
      setNewAction("");
      setError(null);
    } catch (e) {
      setError(e);
    }
  });

  const actionList = gameClass.suggestActions(history[0].state).map(a => {
    const s = JSON.stringify(a);
    return <option value={s} key={s} />;
  });

  const actionForm = (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        list="actions"
        value={newAction}
        onChange={handleActionChange}
      />
      <datalist id="actions">{actionList}</datalist>
      <button type="submit" disabled={!allowSubmit}>
        Apply
      </button>
      <span>{validation}</span>
    </form>
  );

  let filterBlocks = null;
  if (filterKeys != undefined) {
    filterBlocks = filterKeys.map(k => (
      <React.Fragment key={k}>
        <h4>Filter "{k}"</h4>
        <small>
          Additional info for last action:{" "}
          <code>{niceStringify(history[0].newInfos[k])}</code>
        </small>
        <pre>
          <code>{niceStringify(history[0].views[k])}</code>
        </pre>
      </React.Fragment>
    ));
  }

  let errorBlock = null;
  if (error) {
    const errorExtra =
      error.result !== undefined ? (
        <>
          <div>
            Filtered result of actual action:{" "}
            <pre>
              <code>{niceStringify(error.result)}</code>
            </pre>
          </div>
          <div>
            Result of replay:{" "}
            <pre>
              <code>{niceStringify(error.replay)}</code>
            </pre>
          </div>
          <div>
            Difference: <code>{JSON.stringify(error.diff)}</code>
          </div>
        </>
      ) : null;
    errorBlock = (
      <>
        <div>
          <strong>{error.name}</strong> {error.message}
        </div>
        {errorExtra}
      </>
    );
  }

  return (
    <>
      <h3>Full view</h3>
      {errorBlock}
      <small>
        Last action: <code>{niceStringify(history[0].action)}</code>
      </small>
      <pre>
        <code>{niceStringify(history[0].state, null, 2)}</code>
      </pre>
      {actionForm}
      {filterBlocks}
    </>
  );
};

export default PlaygroundApp;
