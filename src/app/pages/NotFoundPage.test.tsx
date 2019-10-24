import {shallow} from "enzyme";
import * as React from "react";
import { NotFoundPage } from "./NotFoundPage";

/* tslint:disable:no-empty jsx-no-lambda */
describe("<NotFoundPage />", () => {
  it("renders without message", () => {
    const wrapper = shallow(
      <NotFoundPage />
    );
    expect(wrapper.containsMatchingElement(
      <p>404 NOT FOUND</p>
    ));
  });

  it("renders with message", () => {
    const wrapper = shallow(
      <NotFoundPage message={"content deleted"} />
    );
    expect(wrapper.containsMatchingElement(
      <p>404 NOT FOUND: content deleted</p>
    ));
  });
});
