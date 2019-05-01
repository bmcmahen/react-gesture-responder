/** @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import { useSpring, animated, interpolate } from "react-spring";
import { usePanResponder, StateType } from "../src";

export interface DragAndReleaseProps {}

export const DragAndRelease: React.FunctionComponent<
  DragAndReleaseProps
> = props => {
  const [active, setActive] = React.useState(false);
  const [style, set] = useSpring(() => ({
    transform: `translate3d(0px, 0px, 0)`
  }));

  const bind = usePanResponder({
    onStartShouldSet: () => true,
    onGrant: () => setActive(true),
    onRelease: end,
    onMove: state => {
      set({
        transform: `translate3d(${state.delta[0]}px, ${state.delta[1]}px, 0)`,
        immediate: false
      });
    },
    onTerminate: end
  });

  function end() {
    setActive(false);

    set({
      transform: `translate3d(0px, 0px, 0)`,
      immediate: false
    });
  }

  return (
    <React.Fragment>
      <animated.div
        style={style}
        css={{
          background: active ? "#08e" : "#ddd",
          cursor: active ? "-webkit-grabbing" : "-webkit-grab",
          borderRadius: "50%",
          width: "85px",
          height: "85px"
        }}
        {...bind}
      />
      <Global
        styles={{
          body: {
            margin: 0,
            padding: 0,
            height: "100%",
            width: "100%",
            overflow: "hidden",
            userSelect: "none",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      />
    </React.Fragment>
  );
};
