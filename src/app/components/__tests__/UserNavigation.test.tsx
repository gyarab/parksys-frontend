import { shallow } from "enzyme";
import * as React from "react";
import { IUserState } from "../../redux/modules/userModule";
import { mapStateToProps, UnconnectedUserNavigation } from "../UserNavigation";

const userProps = {
  id: "1234",
  name: "user1",
  email: "user1@example.com"
};

describe("<UserNavigation />", () => {
  it("maps state to props correctly", () => {
    const state1: IUserState = {
      user: {
        ...userProps,
        permissions: ["a", "b"]
      },
      error: "",
      loaded: false,
      pending: false
    };
    const state2: IUserState = {
      error: "",
      loaded: false,
      pending: false
    };
    const props1 = mapStateToProps({ user: state1 });
    expect(props1).toEqual({
      user: {
        name: "user1",
        email: "user1@example.com"
      }
    });
    const props2 = mapStateToProps({ user: state2 });
    expect(props2.user).toBeNull();
  });

  it("calls logout() when logout button is clicked", () => {
    const spied = jest.fn();
    const wrapper = shallow(
      <UnconnectedUserNavigation user={userProps} logout={spied} />
    );
    const buttonSelector = { name: "logoutButton" };
    expect(wrapper.find(buttonSelector)).toBeDefined();
    expect(spied).not.toHaveBeenCalled();

    wrapper.find(buttonSelector).simulate("click");
    expect(spied).toHaveBeenCalled();
  });

  it("does not render logout button when not logged in", () => {
    const spied = jest.fn();
    const buttonSelector = { name: "logoutButton" };
    const wrapper = shallow(
      <UnconnectedUserNavigation user={null} logout={spied} />
    );
    expect(wrapper.find(buttonSelector)).toEqual({});
  });
});
