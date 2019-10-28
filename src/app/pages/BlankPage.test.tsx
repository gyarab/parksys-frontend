import { shallow } from "enzyme";
import * as React from "react";
import { BlankPage } from "./BlankPage";

/* tslint:disable:no-empty jsx-no-lambda */
describe("<BlankPage />", () => {
  it("renders", () => {
    const wrapper = shallow(<BlankPage />);
    expect(wrapper.find("p")).toBeDefined();
  });
});
