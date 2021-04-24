# XState just got a whole lot easier to learn - here's how

XState 4.18.0 dropped a few days ago, and it brought an important change. Before the release, XState _had_ to be used for modelling finite state machines. Finite state machines are a wonderful tool for modelling complexity. In my project, [XState Catalogue](https://xstate-catalogue.com), you can see how useful they are for building complex features.

But sometimes, using finite state machines - and XState - feels like overkill. There is a ton of API surface area to learn. There's a bunch of confusing terminology (events/actions/services/guards). And, to get the best out of XState, it often feels like you need to know all your states and events in advance.

## Start with no states

From 4.18.0, XState can be used for modelling a reducer - a construct which can receive events and maintain a local piece of state. If you've used [Redux](https://redux.js.org/), or React's [useReducer hook](https://reactjs.org/docs/hooks-intro.html), you'll feel right at home.

If you've never learned XState before, this is your chance to learn it using a pattern you're familiar with.

And personally, I consider XState's reducers an improvement over every other reducer-based framework I've used.

## Let's learn it

Let's imagine we need to model a data fetch inside a component. We'll create a `makeFetch` function that gets called when the user presses a button. For now, we'll ignore error handling and assume that the data fetch can never fail.

Here's how I might express this in pure React:

```tsx
const Component = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const makeFetch = () => {
    // Show the loading indicator
    setIsLoading(true);

    fetch('http://data.com')
      .then((res) => res.json())
      .then((data) => {
        // Hide the loading indicator
        setIsLoading(false);

        // Set the data to what we receive
        setData(data);
      });
  };

  return <button onClick={makeFetch}>Fetch</button>;
};
```

For veteran `useState` haters, you may notice that the multiple, co-ordinated `useState` calls mean that it's time to refactor this into a `useReducer`.

> As a contrivance, I'm calling the `action` usually passed to a reducer an `event`. This will help us later.

```tsx
const reducer = (state = { isLoading: false, data: undefined }, event) => {
  if (event.type === 'BEGIN_FETCH') {
    return {
      ...state,
      isLoading: true,
    };
  }
  if (event.type === 'END_FETCH') {
    return {
      isLoading: false,
      data: event.data,
    };
  }

  return state;
};

const Component = () => {
  const [state, dispatch] = useReducer(reducer);

  const makeFetch = () => {
    dispatch({
      type: 'BEGIN_FETCH',
    });

    fetch('http://data.com')
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: 'END_FETCH',
          data,
        });
      });
  };

  return <button onClick={makeFetch}>Fetch</button>;
};
```

Until now, this wasn't possible to build with XState. Now - you can do this:

```tsx
import { createMachine, assign } from 'xstate';
import { useMachine } from '@xstate/react';

const machine = createMachine({
  context: {
    isLoading: false,
    data: undefined,
  },
  on: {
    BEGIN_FETCH: {
      actions: [
        assign({
          isLoading: true,
        }),
      ],
    },
    END_FETCH: {
      actions: [
        assign((context, event) => {
          return {
            isLoading: false,
            data: event.data,
          };
        }),
      ],
    },
  },
});

const Component = () => {
  const [state, send] = useMachine(machine);

  const makeFetch = () => {
    send({
      type: 'BEGIN_FETCH',
    });

    fetch('http://data.com')
      .then((res) => res.json())
      .then((data) => {
        send({
          type: 'END_FETCH',
          data,
        });
      });
  };

  return <button onClick={makeFetch}>Fetch</button>;
};
```

Note how similar the syntax is. Instead of declaring your reducer as a function, you can declare it with an object-based syntax: using `on` and `actions` to handle updating your state.

## What happens when my reducer grows up?

Nothing stays the same for long in software development, and someone may eventually notice a bug with the above code. In fact, I can see one already.

What happens when the user presses the button while the fetch is already running? We'll probably make two fetches, and whichever fetch returns first will win. This seems wasteful - we should prevent the user from refetching if there's a fetch already going on.
