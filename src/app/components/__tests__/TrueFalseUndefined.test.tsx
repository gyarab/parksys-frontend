import { useTrueFalseUndefined } from "../TrueFalseUndefined";
import React from "react";

describe("TrueFalseUndefined hook", () => {
  it("works", () => {
    const SampleComponent = () => {
      const [value, internal, set] = useTrueFalseUndefined(
        ["on", "off", "---"],
        "on"
      );
      expect(value).toBe("on");
      expect(internal).toBe(true);

      expect(value).toBe("off");
      expect(internal).toBe(false);

      set("---");
      expect(value).toBe("---");
      expect(internal).toBeUndefined();
      return <div></div>;
    };
    <SampleComponent />;
  });
});
