import * as React from "react";
import { storiesOf } from "@storybook/react";
import { useGestureResponder } from "../src";
import { ParentExample } from "./ParentExample";
import { DragAndRelease } from "./DragAndRelease";

type ExampleOptions = any;

function Example({ options, uid = "child", children }: ExampleOptions) {
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(0);

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
        console.log("move");
      },
      ...options
    },
    { uid }
  );

  return (
    <div
      data-testid="example"
      data-active={active}
      {...bind}
      style={{
        border: "1px solid",
        padding: "30px",
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        height: "100%",
        background: active ? "#ddd" : "#eee"
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0
        }}
      >
        {uid}
      </div>
      {children}
    </div>
  );
}

storiesOf("Hello", module)
  .add("Example", () => (
    <div>
      <ParentExample />
    </div>
  ))
  .add("Drag and release", () => <DragAndRelease />)
  .add("prevent responder", () => (
    <Example
      options={{
        onStartShouldSet: () => false,
        onGrant: () => {
          window.alert("I should not alert");
        }
      }}
    />
  ))
  .add("update functions", () => {
    return <Example />;
  })
  .add("non-overridable child swipe", () => (
    <div>
      <Example
        uid="parent-sipe"
        options={{
          onStartShouldSet: () => true,
          onMoveShouldSet: () => true
        }}
      >
        <Example
          uid="child-swipe"
          options={{
            onStartShouldSet: () => true,
            onMoveShouldSet: () => true,
            onTerminationRequest: () => false
          }}
        >
          <Example
            uid="button"
            options={{
              onStartShouldSet: () => true
            }}
          />
        </Example>
      </Example>
    </div>
  ));
