import React from "react";
import { stylesheet, classes } from "typestyle";
import { useTable, useExpanded } from "react-table";
import { Color } from "../constants";

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
  },
  highlighted: {
    backgroundColor: Color.LIGHT_GREY
  }
});

export const StatsTable = ({
  columns,
  data,
  renderSubcomponent = null,
  shouldBeHighlighted
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
          return (
            <React.Fragment key={i}>
              <tr
                {...row.getRowProps()}
                className={classes(
                  row.isExpanded && classNames.expandedRow,
                  shouldBeHighlighted(row) && classNames.highlighted
                )}
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
                      {renderSubcomponent({ row })}
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
