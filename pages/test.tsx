import { useMachine } from "@xstate/react";
import searchableListMachine from "../lib/machines/searchable-list.machine";

const Test = () => {
  const [state, send] = useMachine(searchableListMachine);

  console.log(state.context.pagination.state.context);

  return (
    <div>
      <pre>{JSON.stringify(state.context, null, 2)}</pre>
      <pre>
        {JSON.stringify(state.context.pagination.state.context, null, 2)}
      </pre>
      <input
        type="number"
        onChange={(e) =>
          state.context.pagination.send({
            type: "UPDATE_TOTAL_PAGES",
            totalPages: Number(e.target.value),
          })
        }
      />
      <button
        onClick={() => {
          state.context.pagination.send("PREV_PAGE");
        }}
      >
        PREV
      </button>
      <button
        onClick={() => {
          state.context.pagination.send("NEXT_PAGE");
        }}
      >
        NEXT
      </button>
    </div>
  );
};

export default Test;
