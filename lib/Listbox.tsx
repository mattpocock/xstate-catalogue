import { useFocusRing } from '@react-aria/focus';
import { useListBox, useOption } from '@react-aria/listbox';
import { mergeProps } from '@react-aria/utils';
import { useListState, ListProps } from '@react-stately/list';
import React from 'react';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { AriaListBoxProps } from '@react-types/listbox';

export function ListBox(
  props: ListProps<{}> & { label: string } & AriaListBoxProps<{}>,
) {
  // Create state based on the incoming props
  let state = useListState(props);

  // Get props for the listbox element
  let ref = React.useRef();
  let { listBoxProps, labelProps } = useListBox(props, state, ref);

  return (
    <>
      <VisuallyHidden>
        <div {...labelProps}>{props.label}</div>
      </VisuallyHidden>
      <ul
        {...listBoxProps}
        ref={ref}
        style={{
          padding: 0,
          margin: '5px 0',
          listStyle: 'none',
          border: '1px solid gray',
          maxWidth: 250,
        }}
      >
        {[...state.collection].map((item) => (
          <Option key={item.key} item={item} state={state} />
        ))}
      </ul>
    </>
  );
}

function Option({ item, state }) {
  // Get props for the option element
  let ref = React.useRef();
  let isDisabled = state.disabledKeys.has(item.key);
  let isSelected = state.selectionManager.isSelected(item.key);
  let { optionProps } = useOption(
    {
      key: item.key,
      isDisabled,
      isSelected,
    },
    state,
    ref,
  );

  // Determine whether we should show a keyboard
  // focus ring for accessibility
  let { isFocusVisible, focusProps } = useFocusRing();

  return (
    <li
      {...mergeProps(optionProps, focusProps)}
      ref={ref}
      style={{
        background: isSelected ? 'blueviolet' : 'transparent',
        color: isSelected ? 'white' : null,
        padding: '2px 5px',
        outline: isFocusVisible ? '2px solid orange' : 'none',
      }}
    >
      {item.rendered}
    </li>
  );
}
