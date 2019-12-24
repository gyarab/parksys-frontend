import React from "react";
import { useTable, useExpanded } from "react-table";
import { stylesheet } from "typestyle";
import { connect } from "react-redux";
import { IStore } from "../redux/IStore";

const classNames = stylesheet({
  table: {
    borderSpacing: 0,
    $nest: {
      "th, td": {
        margin: 0,
        padding: "0.6rem",
        borderBottom: "1px solid #ccc"
      },
      "tr:last-child": {
        $nest: {
          "&> td": {
            borderBottom: 0
          }
        }
      }
    }
  },
  expandedRow: {
    $nest: {
      td: {
        borderBottom: 0
      }
    }
  },
  subrow: {
    transition: "height 0.15s ease-out"
  }
});

interface IStateToProps {
  expandedDevices: {
    [id: string]: boolean;
  };
}

const DeviceTable = ({
  columns,
  data,
  renderDeviceSubcomponent,
  expandedDevices
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    flatColumns
  } = useTable(
    {
      columns,
      data
    },
    useExpanded
  );

  // Render the UI for your table
  return (
    <table {...getTableProps()} className={classNames.table}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          if (expandedDevices[row.original.id] && !row.isExpanded) {
            row.toggleExpanded();
          }
          return (
            <React.Fragment key={i}>
              <tr
                {...row.getRowProps()}
                className={row.isExpanded ? classNames.expandedRow : ""}
                key={0}
              >
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr {...row.getRowProps()} key={1}>
                  <td colSpan={flatColumns.length}>
                    <div className={classNames.subrow}>
                      {renderDeviceSubcomponent({ row })}
                    </div>
                  </td>
                </tr>
              ) : null}
            </React.Fragment>
          );
        })}
      </tbody>
    </table>
  );
};

export const mapStateToProps = (
  state: Pick<IStore, "settings" | "devices">
): IStateToProps => ({
  expandedDevices: state.devices.expandedDevices
});

const connected = connect(mapStateToProps, null)(DeviceTable);

export { connected as DeviceTable, DeviceTable as UnconnectedDeviceTable };
