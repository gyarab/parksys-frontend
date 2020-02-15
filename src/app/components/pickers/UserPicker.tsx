import React from "react";
import { stylesheet } from "typestyle";
import {
  GenericModelPicker,
  useGenericPickerFromPicker,
  GenericModelListPicker,
  useGenericListPickerFromListPicker
} from "./GenericModelPicker";
import { USER_SEARCH_QUERY } from "../../constants/Queries";
import { FlagType, Flag } from "../Flag";

const styles = stylesheet({
  userItem: {
    paddingTop: "0.6em",
    $nest: {
      p: {
        marginTop: 0
      }
    }
  }
});

// TODO: Improve this
const RenderUser = user => (
  <div className={styles.userItem}>
    <p>
      {user.name}
      <br />
      {user.email}
      {user.isAdmin ? <Flag type={FlagType.POSITIVE} text={"admin"} /> : null}
    </p>
  </div>
);

export const UserPicker = GenericModelListPicker({
  QUERY: USER_SEARCH_QUERY,
  identifierToOptions: query => ({ variables: { query } }),
  arrayGetter: data => {
    const usersById = {};
    for (const user of data.byEmail.data) {
      usersById[user.id] = user;
    }
    for (const user of data.byName.data) {
      usersById[user.id] = user;
    }
    return Object.values(usersById);
  },
  renderModel: RenderUser
});

export const useUserPicker = useGenericListPickerFromListPicker(UserPicker);

// export const useUserPicker = useGenericPickerFromPicker(
//   UserPicker,
//   user => user.name
// );
