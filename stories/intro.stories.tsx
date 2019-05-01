import * as React from "react";
import { storiesOf } from "@storybook/react";
import { usePanResponder } from "../src";

function Child() {
  const [active, setActive] = React.useState();
  const bind = usePanResponder(
    {
      onStartShouldSet: () => true,
      onGrant: () => setActive(true),
      onRelease: () => setActive(false),
      onTerminate: () => setActive(false)
    },
    "child"
  );

  return (
    <div
      {...bind}
      style={{
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
  const [active, setActive] = React.useState();
  const bind = usePanResponder(
    {
      onStartShouldSet: () => true,
      onGrant: state => {
        console.log("GRANT PARENT");
        setActive(true);
      },
      onRelease: () => setActive(false),
      onMoveShouldSet: () => {
        console.log("mvoe should set parent?");
        return true;
      },
      onTerminate: () => setActive(false)
    },
    "parent"
  );

  return (
    <div
      style={{
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

storiesOf("Hello", module).add("Example", () => (
  <div>
    <Parent />
  </div>
));
