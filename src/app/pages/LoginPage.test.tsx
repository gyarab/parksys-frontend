import { shallow } from "enzyme";
import * as React from "react";
import { UnconnectedLoginPage } from "./LoginPage";
import { initialState } from "../redux/modules/userModule";

describe("<LoginPage />", () => {
  it("password input is of type password", () => {
    const wrapper = shallow(
      <UnconnectedLoginPage
        login={() => null}
        switchPage={fail}
        state={initialState}
      />
    );
    const typeAttr = wrapper
      .find({ name: "password", type: "password" })
      .getElement().props.type;
    expect(typeAttr).toBe("password");
  });

  it("calls login(user, password) when login button is clicked with input data", () => {
    const spied = jest.fn();
    const wrapper = shallow(
      <UnconnectedLoginPage
        state={initialState}
        login={spied}
        switchPage={fail}
      />
    );
    expect(spied).not.toHaveBeenCalled();

    wrapper
      .find({ name: "user", type: "text" })
      .simulate("change", { target: { value: "user1" } });
    wrapper
      .find({ name: "password", type: "password" })
      .simulate("change", { target: { value: "qwerty123" } });
    let calledPreventDefault = false;
    const event = { preventDefault: () => (calledPreventDefault = true) };
    wrapper.find("form").simulate("submit", event);

    expect(calledPreventDefault).toBe(true);
    expect(spied).toHaveBeenCalled();
    expect(spied.mock.calls[0]).toEqual(["user1", "qwerty123"]);
  });

  it("calls switchPage if the user is logged in", () => {
    const spied = jest.fn();
    shallow(
      <UnconnectedLoginPage
        state={{
          ...initialState,
          ...{ refreshToken: "rt", accessToken: "at" }
        }}
        login={fail}
        switchPage={spied}
      />
    );
    expect(spied).toHaveBeenCalled();
  });
});
