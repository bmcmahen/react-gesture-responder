/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { useGestureResponder } from "../src";

function Child() {
  const [active, setActive] = React.useState(false);
  const { bind } = useGestureResponder(
    {
      onStartShouldSet: () => true,
      onGrant: () => setActive(true),
      onRelease: () => {
        console.log("release");
        setActive(false);
      },
      onTerminate: () => {
        console.log("terminate");
        setActive(false);
      },
      onMove: () => {
        console.log("move child");
      }
    },
    { uid: "child" }
  );

  return (
    <div
      data-testid="child"
      data-active={active}
      {...bind}
      css={{
        width: "100px",
        height: "100px",
        background: active ? "#ddd" : "#eee"
      }}
    >
      Child
    </div>
  );
}

function Parent() {
  const [active, setActive] = React.useState(false);
  const { bind } = useGestureResponder(
    {
      onStartShouldSet: state => {
        console.log(state);
        return true;
      },
      onGrant: () => setActive(true),
      onRelease: () => {
        console.log("release parent");
        setActive(false);
      },
      onMoveShouldSet: state => {
        if (
          state.initial[0] == state.xy[0] &&
          state.initial[1] == state.xy[1]
        ) {
          return false;
        }
        return true;
      },
      onMove: () => {
        console.log("move parent");
      },
      onTerminate: () => {
        console.log("terminate");
        setActive(false);
      }
    },
    { uid: "parent" }
  );

  return (
    <div
      data-testid="parent"
      data-active={active}
      css={{
        width: "200px",
        height: "200px",
        border: active ? "2px solid blue" : "2px solid black"
      }}
      {...bind}
    >
      <Child />
    </div>
  );
}

export function ParentExample() {
  return (
    <div>
      <Parent />
    </div>
  );
}
