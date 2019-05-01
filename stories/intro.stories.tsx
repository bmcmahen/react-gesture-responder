import * as React from "react";
import { storiesOf } from "@storybook/react";
import { usePanResponder } from "../src";
import { ParentExample } from "./ParentExample";
import { DragAndRelease } from "./DragAndRelease";

storiesOf("Hello", module)
  .add("Example", () => (
    <div>
      <ParentExample />
    </div>
  ))
  .add("Drag and release", () => <DragAndRelease />);
