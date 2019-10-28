import { shallow } from "enzyme";
import * as React from "react";
import { UnconnectedLoginPage } from "./LoginPage";

describe("<LoginPage />", () => {
  it("calls login() when login button is clicked", () => {
    const spied = jest.fn();
    const wrapper = shallow(<UnconnectedLoginPage login={spied} />);
    const buttonSelector = { name: "loginButton" };
    expect(wrapper.find(buttonSelector)).toBeDefined();
    expect(spied).not.toHaveBeenCalled();

    wrapper
      .find({ name: "user", type: "text" })
      .simulate("change", { target: { value: "user1" } });
    wrapper
      .find({ name: "password", type: "password" })
      .simulate("change", { target: { value: "qwerty123" } });
    wrapper.find(buttonSelector).simulate("click");
    expect(spied).toHaveBeenCalled();
    expect(spied.mock.calls[0]).toEqual(["user1", "qwerty123"]);
  });
});
