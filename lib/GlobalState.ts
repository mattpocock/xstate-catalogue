import { useSelector } from '@xstate/react';
import { createMachine, interpret, Interpreter, assign } from 'xstate';

interface GlobalStateContext {
  themePreference: 'light' | 'dark';
}

export type GlobalStateEvent =
  | {
      type: 'TOGGLE_LAYOUT';
    }
  | { type: 'TOGGLE_THEME' };

const localStorage =
  typeof window !== 'undefined' ? window.localStorage : undefined;

export const globalStateMachine = createMachine<
  GlobalStateContext,
  GlobalStateEvent
>(
  {
    type: 'parallel',
    context: {
      themePreference: 'light',
    },
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
              TOGGLE_LAYOUT: 'blog',
            },
          },
        },
      },
      theme: {
        initial: 'checking',
        states: {
          checking: {
            always: [
              {
                cond: 'isLightTheme',
                target: 'light',
              },
              {
                cond: 'isDarkTheme',
                target: 'dark',
              },
              {
                target: 'light',
              },
            ],
          },
          light: {
            on: {
              TOGGLE_THEME: {
                target: 'dark',
                actions: [
                  'saveDarkThemePreferenceToLocalStorage',
                  assign({
                    themePreference: (context, event) =>
                      (context.themePreference = 'dark'),
                  }),
                ],
              },
            },
          },
          dark: {
            on: {
              TOGGLE_THEME: {
                target: 'light',
                actions: [
                  'saveLightThemePreferenceToLocalStorage',
                  assign({
                    themePreference: (context, event) =>
                      (context.themePreference = 'light'),
                  }),
                ],
              },
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
      isHorizontalLayout: () => {
        return (
          localStorage?.getItem('XSTATE_CATALOGUE_LAYOUT') === 'horizontal'
        );
      },
      isLightTheme: () => {
        return localStorage?.getItem('XSTATE_THEME_PREFERENCE') === 'light';
      },
      isDarkTheme: () => {
        return localStorage?.getItem('XSTATE_THEME_PREFERENCE') === 'dark';
      },
    },
    actions: {
      saveBlogLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'blog');
      },
      saveHorizontalLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'horizontal');
      },
      saveVerticalLayoutToLocalStorage: () => {
        localStorage?.setItem('XSTATE_CATALOGUE_LAYOUT', 'vertical');
      },
      saveDarkThemePreferenceToLocalStorage: () => {
        localStorage?.setItem('XSTATE_THEME_PREFERENCE', 'dark');
      },
      saveLightThemePreferenceToLocalStorage: () => {
        localStorage?.setItem('XSTATE_THEME_PREFERENCE', 'light');
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
    if (state.matches('layout.horizontal')) {
      return 'horizontal';
    }
    return null;
  });
  return layout;
};
