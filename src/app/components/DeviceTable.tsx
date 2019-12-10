import React from "react";
import { useTable, useExpanded } from "react-table";
import { stylesheet } from "typestyle";

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
  }
});

const DeviceTable = ({ columns, data, renderDeviceSubcomponent }) => {
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
          return (
            <React.Fragment key={i}>
              <tr
                {...row.getRowProps()}
                className={row.isExpanded ? classNames.expandedRow : ""}
              >
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
              {row.isExpanded ? (
                <tr {...row.getRowProps()}>
                  <td colSpan={flatColumns.length}>
                    {renderDeviceSubcomponent({ row })}
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

export default DeviceTable;
