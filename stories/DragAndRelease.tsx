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
  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0]
  }));

  const { bind } = usePanResponder({
    onStartShouldSet: () => true,
    onGrant: () => setActive(true),
    onRelease: end,
    onMove: state => {
      console.log(state.velocity);
      set({
        xy: state.delta,
        immediate: true
      });
    },
    onTerminate: end
  });

  function end(state: StateType) {
    console.log(state);
    setActive(false);

    set({
      xy: [0, 0],
      immediate: false
    });
  }

  const interpolate = (x: number, y: number) =>
    `translate3d(${x}px, ${y}px, 0)`;

  return (
    <React.Fragment>
      <animated.div
        style={{
          transform: xy.interpolate(interpolate as any)
        }}
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
