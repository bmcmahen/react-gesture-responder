import * as React from "react";
import { storiesOf } from "@storybook/react";
import { usePanResponder } from "../src";
import { ParentExample } from "./ParentExample";
import { DragAndRelease } from "./DragAndRelease";

type ExampleOptions = any;

function Example({ options }: ExampleOptions) {
  const [active, setActive] = React.useState(false);
  const [count, setCount] = React.useState(0);

  const { bind } = usePanResponder(
    {
      onStartShouldSet: () => true,
      onGrant: () => setActive(true),
      onRelease: () => {
        console.log("COUNT ON RELEASE", count);
        setActive(false);
      },
      onTerminate: () => setActive(false),
      ...options
    },
    "child"
  );

  React.useEffect(() => {
    const timer = setInterval(() => {
      console.log("set count: ", count + 1);
      setCount(count + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [count]);

  return (
    <div
      data-testid="example"
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
  });
