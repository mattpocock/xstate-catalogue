import {
  ActorRefFrom,
  assign,
  createMachine,
  interpret,
  send,
  Sender,
  spawn,
} from "xstate";
import paginationMachine, {
  PaginationMachineEvent,
} from "./pagination.machine";

interface SearchableListMachineContext {
  pagination: ActorRefFrom<typeof paginationMachine>;
  data: Data[];
}

interface Data {
  id: number;
}

type SearchableListMachineEvent =
  | {
      type: "RECEIVE_DATA";
      data: Data[];
      totalPages: number;
    }
  | {
      type: "PAGE_CHANGED";
    }
  | {
      type: "SEARCH_VALUE_CHANGED";
    };

const searchableListMachine = createMachine<
  SearchableListMachineContext,
  SearchableListMachineEvent
>(
  {
    id: "searchableList",
    entry: ["initPagination", "initSearchBox"],
    initial: "fetchingData",
    invoke: [
      {
        src: "subscribeToPage",
      },
      {
        src: "subscribeToSearchBox",
      },
    ],
    states: {
      fetchingData: {
        on: {
          PAGE_CHANGED: {
            target: "fetchingData",
          },
          RECEIVE_DATA: {
            target: "idle",
            actions: ["assignDataToContext", "updateTotalPages"],
          },
          SEARCH_VALUE_CHANGED: {
            target: "fetchingData",
          },
        },
        invoke: {
          src: "fetchData",
        },
      },
      idle: {
        on: {
          PAGE_CHANGED: {
            target: "fetchingData",
          },
          SEARCH_VALUE_CHANGED: {
            target: "fetchingData",
            actions: "goBackToFirstPageOfResults",
          },
        },
      },
    },
  },
  {
    actions: {
      initPagination: assign(() => {
        return {
          pagination: spawn(paginationMachine, { sync: true }),
        };
      }),
      updateTotalPages: (context, event) => {
        if (event.type !== "RECEIVE_DATA") return;
        context.pagination.send({
          type: "UPDATE_TOTAL_PAGES",
          totalPages: event.totalPages,
        });
      },
      goBackToFirstPageOfResults: (context) => {
        context.pagination.send({
          type: "GO_TO_TARGET_PAGE",
          targetPage: 1,
        });
      },
    },
    services: {
      subscribeToPage: (context) => (
        send: Sender<SearchableListMachineEvent>,
      ) => {
        let prevState = context.pagination.state;
        const ref = context.pagination.subscribe((state) => {
          if (state.context.currentPage !== prevState.context.currentPage) {
            send("PAGE_CHANGED");
          }
          prevState = state;
        });

        return ref.unsubscribe;
      },
    },
  },
);

export default searchableListMachine;
