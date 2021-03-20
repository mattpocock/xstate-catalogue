import { useService } from "@xstate/react";
import React, { useContext } from "react";
import { Interpreter } from "xstate";

export const MachineHelpersContext = React.createContext<{
  service: Interpreter<any, any, any>;
}>({} as any);

export const State = (props: { children: string }) => {
  const context = useContext(MachineHelpersContext);
  const [state] = useService(context.service);
  return (
    <span
      className={`font-mono font-bold text-sm px-2 py-1 transition-colors ${
        state.matches(props.children)
          ? `bg-green-100 text-green-800`
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {props.children}
    </span>
  );
};

export const Event = (props: { children: string }) => {
  const context = useContext(MachineHelpersContext);
  const [state, send] = useService(context.service);

  return (
    <button
      onClick={() => {
        send(props.children);
      }}
      // To override prose
      style={{ margin: 0 }}
    >
      <span
        className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors ${
          state.nextEvents.includes(props.children)
            ? `bg-yellow-100 text-yellow-800`
            : ""
        }`}
      >
        {props.children}
      </span>
    </button>
  );
};

export const Action = (props: { children: string }) => {
  const context = useContext(MachineHelpersContext);
  const [state, send] = useService(context.service);

  const justFired = state.actions.some(
    (action) => action.type === props.children,
  );
  return (
    <span
      className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors`}
    >
      {props.children}
    </span>
  );
};

export const Service = (props: { children: string }) => {
  return (
    <span
      className={`bg-gray-100 text-gray-600 font-mono font-bold text-sm px-2 py-1 transition-colors`}
    >
      {props.children}
    </span>
  );
};
