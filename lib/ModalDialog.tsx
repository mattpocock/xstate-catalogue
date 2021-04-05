import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import {
  OverlayProps,
  useModal,
  useOverlay,
  usePreventScroll,
} from '@react-aria/overlays';
import { AriaDialogProps } from '@react-types/dialog';
import React from 'react';

export const ModalDialog: React.FC<
  OverlayProps & { title: string } & AriaDialogProps
> = (props) => {
  let { title, children } = props;

  let ref = React.useRef();
  let { overlayProps } = useOverlay(props, ref);

  usePreventScroll();
  let { modalProps } = useModal();

  let { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 100,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <FocusScope contain restoreFocus autoFocus>
        <div {...overlayProps} {...dialogProps} {...modalProps} ref={ref}>
          <VisuallyHidden>
            <h3 {...titleProps} style={{ marginTop: 0 }}>
              {title}
            </h3>
          </VisuallyHidden>
          {children}
        </div>
      </FocusScope>
    </div>
  );
};
