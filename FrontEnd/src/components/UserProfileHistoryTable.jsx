import "../css/UserProfile.css";
import { useGetFetch } from "../customHooks/useGetFetch";
import { useState, useEffect } from "react";
import { useReactTable, getCoreRowModel, flexRender, getFilteredRowModel, getPaginationRowModel, getSortedRowModel } from "@tanstack/react-table"
// Icons that were used:
import { BiSort } from "react-icons/bi";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { useAuth } from "../customHooks/AuthContext";

export function UserProfileHistoryTable() {

    const {auth, setAuth} = useAuth();
    const [ID, setID] = useState(auth.ID)
    const {data: accountRecordData, isPending, error, triggerGet} = useGetFetch();
    const [columnFilters, setColumnFilters] = useState([])
      // Trigger Fetch
    useEffect(() => {
    triggerGet(`http://localhost:8080/profile-history/${ID}`)
    }, [])
    
    // Filter
    const date_in = (columnFilters ?? []).find(
        filter => filter.id == "date_in"
    )?.value || ""

    const onFilterChange = (id, value) => setColumnFilters(
        prev => prev.filter(f => f.id !== id).concat({
            id, value
        })
    )
    
      // Prefix Filter (Integer Only)
    const prefixFilterFn = (row, columnId, filterValue) => {
        const cellValue = String(row.getValue(columnId));
        return cellValue.startsWith(String(filterValue));
    };
    
      // Column definitions
    const columns = [
        {
            accessorKey: "date_in",
            header: "Date In",
            filterFn: prefixFilterFn,
            cell: (props) => <p>{props.getValue()}</p>
    
        },
        {
            accessorKey: "time_in",
            header: "Time In",
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: "date_out",
            header: "Date Out",
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: "time_out",
            header: "Time Out",
            cell: (props) => <p>{props.getValue()}</p>
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: (props) => <p> {(props.getValue()/60).toFixed(2)} {(props.getValue()/60) < 1 ? "Hour" : "Hours"} </p>  
        },
        {
            accessorKey: "location",
            header: "Location",
            cell: (props) => <p>{props.getValue()}</p>
        },
    ]
    
      // Table Definition
    const table = useReactTable({
        data: accountRecordData, 
        columns, 
        state: {   
            columnFilters,
        },
        getCoreRowModel: getCoreRowModel(), 
        getFilteredRowModel: getFilteredRowModel(), 
        getPaginationRowModel: getPaginationRowModel(), 
        getSortedRowModel: getSortedRowModel() 
    })
    return(
        <>
            <input 
                type="text"
                value={date_in}
                onChange={(e) => onFilterChange("date_in", e.target.value)}
                placeholder="Search for date in"
            
            ></input>
            <table className="__table__">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(
                            // now we can use the header array to render
                            (header) => (
                                <th key={header.id}>
                                    {header.column.columnDef.header}
                                    {header.column.getCanSort() && (
                                        <BiSort
                                            size={20}
                                            onClick={header.column.getToggleSortingHandler()}
                                            style={{
                                                color: "rgb(44, 102, 110)",
                                                marginLeft: "5px",
                                                cursor: "pointer",
                                            }}
                                        />
                                    )}
                                    {
                                        {
                                            asc: (
                                            <span className="sort-indicator asc">
                                                {" "}
                                                <IoMdArrowDropup size={25} />
                                            </span>
                                            ),
                                            desc: (
                                            <span className="sort-indicator desc">
                                                {" "}
                                                <IoMdArrowDropdown size={25} />
                                            </span>
                                            ),
                                        }[header.column.getIsSorted()]
                                    }
                                </th>
                            )
                        )}
                    </tr>
                ))}
                </thead>
                <tbody>
                    {
                    table.getRowModel().rows.map( row => <tr key={row.id}>
                        {row.getVisibleCells().map(cell => <td key={cell.id}>
                        {
                            flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )
                        }
                        </td>)}
                    </tr>)
                    }
                </tbody>
            </table>
            <br />
            <p>
                Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="buttonPagination"> { /* you may use this class name to edit the pagination button */ }
                <button
                onClick ={() => table.setPageIndex(0)}
                disabled = {!table.getCanPreviousPage()}
                >{"<<"}</button>
                <button
                onClick = {() => table.previousPage()}
                disabled = {!table.getCanPreviousPage()}
                >{"<"}</button>
                <button
                onClick ={() => table.nextPage()}
                disabled = {!table.getCanNextPage()}
                >{">"}</button>
                <button
                onClick = {() => table.setPageIndex(table.getPageCount() - 1)}
                disabled = {!table.getCanNextPage()}
                >{">>"}</button>
            </div>
        </>
    )
}