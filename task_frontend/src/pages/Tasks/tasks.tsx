import React from 'react'
import { useTable, Column } from "react-table"

interface TableProps<T extends object> {
    columns: Column<T>[];
    data: T[];
}

const Tasks = <T extends object>({ columns, data }: TableProps<T>) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable<T>({ columns, data });

    return (
        <table {...getTableProps()} style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()} style={{ border: "1px solid black", padding: "8px" }}>
                                {column.render("Header")}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell) => (
                                <td {...cell.getCellProps()} style={{ border: "1px solid black", padding: "8px" }}>
                                    {cell.render("Cell")}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};


export default Tasks