/** @jsx jsx */
import { css, jsx } from "@emotion/core";
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { usePanResponder } from "../src";

function Child() {
  const [active, setActive] = React.useState(false);
  const { bind } = usePanResponder(
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
  const { bind } = usePanResponder(
    {
      onStartShouldSet: () => true,
      onGrant: () => setActive(true),
      onRelease: () => setActive(false),
      onMoveShouldSet: state => {
        console.log(state.xy);
        return true;
      },
      onMove: () => {
        console.log(active);
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
