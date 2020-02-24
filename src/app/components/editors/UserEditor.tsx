import React, { useMemo, useEffect } from "react";
import { stylesheet, classes } from "typestyle";
import { IUserMngmtPageState } from "../../redux/modules/userMngmtPageModule";
import { UserIdentifierDisplay } from "../user/UserIdentifierDisplay";
import { UserSections } from "../user/UserSections";
import { UserSection } from "../user/UserSection";
import { Button } from "../Button";
import { Color } from "../../constants";

const styles = stylesheet({
  userEditor: {
    borderRight: `1px solid ${Color.LIGHT_GREY}`,
    paddingRight: "1em",
    height: "100%",
    $nest: {
      "> .header": {
        display: "grid",
        gridTemplateColumns: "1fr auto",
        borderBottom: "1px solid #ccc",
        marginBottom: "2em",
        $nest: {
          "> .controls": {
            display: "grid",
            gridAutoColumns: "auto",
            gridTemplateRows: "auto auto",
            $nest: {
              button: {
                width: "100%"
              }
            }
          }
        }
      }
    }
  }
});

interface IProps {
  user: IUserMngmtPageState["selectedUser"];
  updateUser: (updates) => void;
}

const UserPermissionEditor = ({ permissions }) => {
  return <div>permissions editor</div>;
};

export const UserEditor = (props: IProps): JSX.Element => {
  const deleteUser = () => {
    console.log(`DELETE ${props.user.email}`);
  };
  const toggleActivation = () => {
    props.updateUser({
      active: !props.user.active
    });
  };
  return (
    <div className={styles.userEditor}>
      <div className="header">
        <div style={{ height: "100%" }}>
          <UserIdentifierDisplay {...props.user} />
        </div>
        <div className="controls">
          <div>
            <Button type="negative" onClick={deleteUser}>
              Delete
            </Button>
          </div>
          <div>
            <Button type="negative" onClick={toggleActivation}>
              {props.user.active ? "Deactivate" : "Activate"}
            </Button>
          </div>
        </div>
      </div>
      <UserSections>
        <UserSection title="Permissions">
          <UserPermissionEditor permissions={props.user.permissions} />
        </UserSection>
      </UserSections>
    </div>
  );
};
