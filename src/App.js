import { useReducer } from "react";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";
import "./App.css";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  CLEAR: "clear",
  DELETE_DIGIT: "delete-digit",
  CHOOSE_OP: "choose-op",
  EVALUATE: "evaluate",
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite === true) {
        return {
          ...state,
          overwrite: false,
          currOp: payload.digit,
        };
      }
      if (payload.digit === "0" && state.currOp === "0") return state;
      if (payload.digit === "." && state.currOp.includes(".")) return state;
      return {
        ...state,
        currOp: `${state.currOp || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OP:
      if (state.currOp == null && state.prevOp == null) return state;
      if (state.prevOp == null) {
        return {
          ...state,
          op: payload.operation,
          prevOp: state.currOp,
          currOp: null,
        };
      }
      if (state.currOp == null) {
        return {
          ...state,
          op: payload.operation,
          currOp: null,
        };
      }
      return {
        ...state,
        op: payload.operation,
        currOp: null,
        prevOp: evaluate(state),
      };
    case ACTIONS.CLEAR:
      return {
        ...state,
        currOp: null,
        prevOp: null,
        op: null,
      };
    case ACTIONS.EVALUATE:
      if (state.op == null || state.currOp == null || state.prevOp == null)
        return state;
      return {
        ...state,
        overwrite: true,
        currOp: evaluate(state),
        op: null,
        prevOp: null,
      };
    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite === true) {
        return {
          currOp: null,
        };
      }
      return {
        ...state,
        currOp: state.currOp.slice(0, -1),
      };
  }
};

const evaluate = ({ currOp, prevOp, op }) => {
  const prev = parseFloat(prevOp);
  const curr = parseFloat(currOp);
  let res = "";
  switch (op) {
    case "+":
      res = prev + curr;
      break;
    case "-":
      res = prev - curr;
      break;
    case "÷":
      res = prev / curr;
      break;
    case "*":
      res = prev * curr;
      break;
  }
  return res.toString();
};

const format = (operand) => {
  if (operand == null) return;
  const [int, dec] = operand.split(".");
  if (dec == null) return INTEGER_FORMAT.format(int);
  return `${INTEGER_FORMAT.format(int)}.${dec}`;
};

const INTEGER_FORMAT = new Intl.NumberFormat("en-in", {
  maximumFractionDigits: 0,
});

function App() {
  const [{ currOp, prevOp, op }, dispatch] = useReducer(reducer, {});
  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="prev-op">
          {format(prevOp)}
          {op}
        </div>
        <div className="curr-op">{format(currOp)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.CLEAR })}
      >
        AC
      </button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>
        DEL
      </button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="*" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="-" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
      >
        =
      </button>
    </div>
  );
}

export default App;
