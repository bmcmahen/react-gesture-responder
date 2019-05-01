import * as React from "react";
import { render, fireEvent, cleanup } from "react-testing-library";
import "jest-dom/extend-expect";
import { usePanResponder } from "..";

afterEach(cleanup);

type ExampleOptions = any;

function Example({
  options,
  id = "example",
  enableMouse = true
}: ExampleOptions) {
  const [active, setActive] = React.useState(false);
  const { bind } = usePanResponder(
    {
      onStartShouldSet: () => true,
      onGrant: () => setActive(true),
      onRelease: () => setActive(false),
      onTerminate: () => setActive(false),
      ...options
    },
    { uid: id, enableMouse }
  );

  return (
    <div data-testid={id} data-active={active} {...bind}>
      Child
    </div>
  );
}

test("the appropriate events fire", async () => {
  const onGrant = jest.fn();
  const onMove = jest.fn();
  const onRelease = jest.fn();
  const onTerminate = jest.fn();

  const { getByTestId } = render(
    <Example
      options={{
        onGrant,
        onMove,
        onRelease,
        onTerminate
      }}
    />
  );

  const child = getByTestId("example");

  // mouse events
  fireEvent.mouseDown(child);
  expect(onGrant).toBeCalled();
  fireEvent.mouseMove(child);
  expect(onMove).toBeCalled();
  fireEvent.mouseUp(child);
  expect(onRelease).toBeCalled();

  // touch events
  fireEvent.touchStart(child);
  fireEvent.touchMove(child);
  fireEvent.touchEnd(child);
  expect(onGrant).toBeCalledTimes(2);
  expect(onMove).toBeCalledTimes(4);
  expect(onRelease).toBeCalledTimes(2);
});

test("prevent responder from setting", () => {
  const onGrant = jest.fn();
  const onMove = jest.fn();
  const { getByTestId } = render(
    <Example
      options={{
        onStartShouldSet: () => false,
        onGrant,
        onMove
      }}
    />
  );

  const child = getByTestId("example");
  fireEvent.mouseDown(child);
  expect(onGrant).toBeCalledTimes(0);

  fireEvent.mouseMove(child);
  expect(onMove).toBeCalledTimes(0);

  fireEvent.touchStart(child);
  expect(onGrant).toBeCalledTimes(0);

  fireEvent.touchMove(child);
  expect(onMove).toBeCalledTimes(0);
});

test("it prevents subsequent starts from claiming the responder when bubbling", () => {
  const onGrant = jest.fn();
  const { getByTestId } = render(
    <React.Fragment>
      <Example
        options={{
          onStartShouldSet: () => true
        }}
      />
      <Example
        id="other"
        options={{
          onStartShouldSet: () => true,
          onGrant
        }}
      />
    </React.Fragment>
  );

  const child = getByTestId("example");
  fireEvent.mouseDown(child);

  const other = getByTestId("other");
  fireEvent.mouseDown(other);

  expect(onGrant).toBeCalledTimes(0);
});

test("it overrites existing when move is set", () => {
  const onGrant = jest.fn();
  const otherTerminate = jest.fn();
  const { getByTestId } = render(
    <React.Fragment>
      <Example
        id="release"
        options={{
          onStartShouldSet: () => true
        }}
      />
      <Example
        id="other"
        options={{
          onStartShouldSet: () => true,
          onMoveShouldSet: () => {
            return true;
          },
          onGrant,
          onTerminate: otherTerminate
        }}
      />
    </React.Fragment>
  );

  const child = getByTestId("release");
  fireEvent.mouseDown(child);

  const other = getByTestId("other");
  fireEvent.mouseDown(other);
  fireEvent.mouseMove(other);

  expect(onGrant).toBeCalled();
  expect(otherTerminate).toBeCalledTimes(0);
});

test("disabling mouse events works", () => {
  const onGrant = jest.fn();
  const onMove = jest.fn();
  const { getByTestId } = render(
    <Example
      enableMouse={false}
      options={{
        onStartShouldSet: () => true,
        onGrant,
        onMove
      }}
    />
  );

  const child = getByTestId("example");
  fireEvent.mouseDown(child);
  expect(onGrant).toBeCalledTimes(0);
  fireEvent.mouseMove(child);
  expect(onMove).toBeCalledTimes(0);
});
