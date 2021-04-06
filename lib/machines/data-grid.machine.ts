import { assign, createMachine, Sender } from 'xstate';

export interface DataGridMachineContext {
  sortingColumn: ColumnId;
  rowIdEditing?: string;
  data?: Row[];
  rowErrors: Record<string, { message: string }>;
}

type ColumnId = 'name' | 'age';

interface Row {
  id: string;
  name: string;
  age: number;
}

export type DataGridMachineEvent =
  | {
      type: 'CLICK_COLUMN_HEADER';
      column: ColumnId;
    }
  | {
      type: 'CLICK_EDIT_ROW';
      rowId: string;
    }
  | {
      type: 'CLICK_CREATE_ROW';
      newId: string;
    }
  | {
      type: 'ON_ROW_CHANGE';
      newRow: Row;
    }
  | {
      type: 'ADD_NEW_ROW';
    }
  | {
      type: 'RECEIVE_DATA';
      data: Row[];
    }
  | {
      type: 'RETRY';
    };

const dataGridMachine = createMachine<
  DataGridMachineContext,
  DataGridMachineEvent
>(
  {
    id: 'dataGrid',
    initial: 'fetchingData',
    states: {
      fetchingData: {
        invoke: {
          src: 'fetchData',
          onError: {
            target: 'couldNotFetchData',
          },
        },
        on: {
          RECEIVE_DATA: {
            target: 'idle',
            actions: [
              assign((context, event) => {
                return {
                  data: event.data,
                };
              }),
            ],
          },
        },
      },
      couldNotFetchData: {
        on: {
          RETRY: {
            target: 'fetchingData',
          },
        },
      },
      idle: {
        type: 'parallel',
        states: {
          edit: {
            initial: 'idle',
            states: {
              idle: {
                on: {
                  CLICK_CREATE_ROW: {
                    target: 'editingRow.throttling',
                    actions: 'createNewRowAndMarkAsEditing',
                  },
                  CLICK_EDIT_ROW: {
                    target: 'editingRow',
                    actions: assign((context, event) => {
                      return {
                        rowIdEditing: event.rowId,
                      };
                    }),
                  },
                },
              },
              editingRow: {
                exit: [
                  assign((context) => ({
                    rowIdEditing: undefined,
                  })),
                ],
                on: {
                  ON_ROW_CHANGE: {
                    actions: ['assignNewRowToContext', 'clearErrorsFromRow'],
                    target: '.throttling',
                    // This ensures the throttle works
                    internal: false,
                  },
                },
                initial: 'idle',
                states: {
                  idle: {
                    on: {
                      CLICK_CREATE_ROW: {
                        actions: ['createNewRowAndMarkAsEditing'],
                        target: 'throttling',
                      },
                      CLICK_EDIT_ROW: {
                        actions: assign((context, event) => {
                          return {
                            rowIdEditing: event.rowId,
                          };
                        }),
                      },
                    },
                  },
                  throttling: {
                    after: {
                      800: {
                        target: 'updatingRow',
                      },
                    },
                  },
                  updatingRow: {
                    invoke: {
                      src: 'updateRow',
                      onDone: {
                        target: 'idle',
                      },
                      onError: {
                        actions: 'markRowAsErrored',
                        target: 'idle',
                      },
                    },
                  },
                },
              },
            },
          },
          sort: {
            initial: 'asc',
            on: {},
            states: {
              asc: {
                on: {
                  CLICK_COLUMN_HEADER: [
                    {
                      cond: 'isSameColumnHeaderAsSelected',
                      target: 'desc',
                    },
                    {
                      actions: 'assignNewColumnHeader',
                    },
                  ],
                },
              },
              desc: {
                on: {
                  CLICK_COLUMN_HEADER: [
                    {
                      cond: 'isSameColumnHeaderAsSelected',
                      target: 'asc',
                    },
                    {
                      actions: 'assignNewColumnHeader',
                      target: 'asc',
                    },
                  ],
                },
              },
            },
          },
        },
      },
    },
  },
  {
    guards: {
      isSameColumnHeaderAsSelected: (context, event) => {
        if (event.type !== 'CLICK_COLUMN_HEADER') return false;
        return context.sortingColumn === event.column;
      },
    },
    actions: {
      markRowAsErrored: assign((context, event: any) => {
        return {
          rowErrors: {
            ...context.rowErrors,
            [context.rowIdEditing]:
              event.data?.message || 'An unknown error occurred',
          },
        };
      }),
      assignNewRowToContext: assign((context, event) => {
        if (event.type !== 'ON_ROW_CHANGE') return {};

        return {
          data:
            context.data?.map((data) => {
              if (data?.id !== event.newRow?.id) {
                return data;
              }

              return event.newRow;
            }) || [],
        };
      }),
      clearErrorsFromRow: assign((context, event) => {
        return {
          rowErrors: {
            ...context.rowErrors,
            [context.rowIdEditing]: undefined,
          },
        };
      }),
      createNewRowAndMarkAsEditing: assign((context, event) => {
        if (event.type !== 'CLICK_CREATE_ROW') return {};
        return {
          data: [
            { id: event.newId, name: '', age: 18 },
            ...(context.data || []),
          ],
          rowIdEditing: event.newId,
        };
      }),
    },
    services: {
      updateRow: () => () => {},
    },
  },
);

export default dataGridMachine;
