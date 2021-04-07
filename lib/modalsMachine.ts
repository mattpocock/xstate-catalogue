import { assign, createMachine, Interpreter, Sender } from 'xstate';

interface Context {
  searchModalText: string;
}

type Event =
  | {
      type: 'CMD_K_PRESSED';
    }
  | {
      type: 'CLICK_SEARCH';
    }
  | {
      type: 'UPDATE_SEARCH_MODAL_TEXT';
      text: string;
    }
  | {
      type: 'CLOSE';
    };

export type ModalsMachineInterpreter = Interpreter<Context, any, Event>;

export const modalsMachine = createMachine<Context, Event>(
  {
    initial: 'idle',
    context: {
      searchModalText: '',
    },
    states: {
      idle: {
        on: {
          CMD_K_PRESSED: {
            target: 'showingSearchModal',
          },
          CLICK_SEARCH: {
            target: 'showingSearchModal',
          },
        },
        invoke: {
          src: 'listenForKeyboardShortcuts',
        },
      },
      showingSearchModal: {
        on: {
          CLOSE: 'idle',
          UPDATE_SEARCH_MODAL_TEXT: {
            actions: assign((context, event) => {
              return {
                searchModalText: event.text,
              };
            }),
          },
        },
      },
    },
  },
  {
    services: {
      listenForKeyboardShortcuts: () => (send: Sender<Event>) => {
        const listener = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            send('CMD_K_PRESSED');
          }
        };
        document.addEventListener('keydown', listener);

        return () => {
          document.removeEventListener('keydown', listener);
        };
      },
    },
  },
);
