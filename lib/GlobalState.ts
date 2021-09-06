import { useSelector } from '@xstate/react';
import { createMachine, interpret, Interpreter } from 'xstate';

interface GlobalStateContext {}

export type GlobalStateEvent = {
  type: 'TOGGLE_LAYOUT';
};

const localStorage =
  typeof window !== 'undefined' ? window.localStorage : undefined;

export const globalStateMachine = createMachine<
  GlobalStateContext,
  GlobalStateEvent
>(
  {
    type: 'parallel',
    states: {
      layout: {
        initial: 'checking',
        states: {
          checking: {
            always: [
              {
                cond: 'isVerticalLayout',
                target: 'vertical',
              },
              {
                cond: 'isHorizontalLayout',
                target: 'horizontal',
              },
              {
                cond: 'isInspectorLayout',
                target: 'inspector',
              },
              {
                target: 'blog',
              },
            ],
          },
          blog: {
            entry: ['saveBlogLayoutToLocalStorage'],
            on: {
              TOGGLE_LAYOUT: 'horizontal',
            },
          },
          horizontal: {
            entry: ['saveHorizontalLayoutToLocalStorage'],
            on: {
              TOGGLE_LAYOUT: 'vertical',
            },
          },
          vertical: {
            entry: ['saveVerticalLayoutToLocalStorage'],
            on: {
              TOGGLE_LAYOUT: 'inspector',
            },
          },
          inspector: {
            entry: ['saveInspectorLayoutToLocalStorage'],
            on: {
              TOGGLE_LAYOUT: 'blog',
            },
          },
        },
      },
    },
  },
  {
    guards: {
      isVerticalLayout: () => {
        return localStorage?.getItem('XSTATE_CATALOGUE_LAYOUT') === 'vertical';
      },
      isInspectorLayout: () => {
        return localStorage?.getItem('XSTATE_CATALOGUE_LAYOUT') === 'inspector';
      },
      isHorizontalLayout: () => {
        return (
          localStorage?.getItem('XSTATE_CATALOGUE_LAYOUT') === 'horizontal'
        );
      },
    },
    actions: {
      saveBlogLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'blog');
      },
      saveInspectorLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'inspector');
      },
      saveHorizontalLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'horizontal');
      },
      saveVerticalLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'vertical');
      },
    },
  },
);

export let globalStateService = undefined as Interpreter<
  GlobalStateContext,
  any,
  GlobalStateEvent
>;

if (typeof window !== 'undefined') {
  globalStateService = interpret(globalStateMachine).start();
}

export const useLayout = () => {
  if (!globalStateService) return null;
  const layout = useSelector(globalStateService, (state) => {
    if (state.matches('layout.blog')) {
      return 'blog';
    }
    if (state.matches('layout.vertical')) {
      return 'vertical';
    }
    if (state.matches('layout.inspector')) {
      return 'inspector';
    }
    if (state.matches('layout.horizontal')) {
      return 'horizontal';
    }
    return null;
  });
  return layout;
};
