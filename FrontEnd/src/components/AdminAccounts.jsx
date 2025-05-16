import "../css/AdminAccounts.css"; // css for AdminAccounts and AdminHistory
import { AdminTableFilter } from "./AdminTableFilter";
import { useGetFetch } from "../customHooks/useGetFetch";
import { useState, useEffect } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

// Icons that were used:
import { BiSort } from "react-icons/bi";
import { IoMdArrowDropup } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";

export function AdminAccounts() {
  const [accountType, setAccountType] = useState("Student");
  const {
    data: accountRecordData,
    isPending,
    error,
    triggerGet,
  } = useGetFetch();
  const [columnFilters, setColumnFilters] = useState([
    { id: "account_type", value: ["Student"] }
  ]);

  // Trigger Fetch
  useEffect(() => {
    triggerGet(`http://localhost:8080/accountRecord`);
  }, []);

  // Prefix Filter (Integer Only)
  const prefixFilterFn = (row, columnId, filterValue) => {
    const cellValue = String(row.getValue(columnId));
    return cellValue.startsWith(String(filterValue));
  };

  // Column definitions
  const columns = [
    {
      accessorKey: "user_id",
      header: `${accountType} Number`,
      filterFn: prefixFilterFn,
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "account_type",
      header: "Account Type",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "vehicle_plate",
      header: "Vehicle Plate",
      cell: (props) => <p>{props.getValue()}</p>,
    },
    {
      accessorKey: "vehicle_type",
      header: "Vehicle Type",
      cell: (props) => <p>{props.getValue()}</p>,
    },
  ];

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
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSelectAccountType = (type) => {
    setAccountType(type);

    setColumnFilters((prev) => {
      // Check if there are any active filters for the account type
      const hasFilter = prev.find(
        (filter) => filter.id === "account_type"
      )?.value;
      // If there is a filter for account type, update it
      if (hasFilter) {
        return prev.map((filter) => {
          if (filter.id === "account_type") {
            return { ...filter, value: type };
          } else {
            return filter;
          }
        });
      } else {
        // If there is no filter for account type, then create one
        if (!hasFilter) {
          return prev.concat({
            id: "account_type",
            value: [type],
          });
        }
      }
    });
  };

  if (isPending) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  return (
    <>
      {/* TOP CONTENT */}
      <section className="adminAccounts section" id="adminAccounts">
        <div className="adminAccounts__container">
          <div className="adminAccounts__content">
            <h1 className="adminAccounts__title">Accounts</h1>
            <p className="description">
              Select account tags to view students and workers.
            </p>
          </div>
        </div>
      </section>

      {/* TABLES */}
      <section className="adminAccountsLayout">
        <div className="adminAccountsLayout__container">
          {/* SIDE ACCOUNTS */}
          <div className="accountsCategoryTable__container">
            <div className="accountsCategoryTable__content">
              {/* BUTTONS */}
              <button
                className={`accountsButton ${
                  accountType === "Student" ? "active" : ""
                }`}
                onClick={() => handleSelectAccountType("Student")}
              >
                Students
              </button>
              <button
                className={`accountsButton ${
                  accountType === "Worker" ? "active" : ""
                }`}
                onClick={() => handleSelectAccountType("Worker")}
              >
                Workers
              </button>
            </div>
          </div>
          <div className="adminAccountsTable__container">
            <div className="accountsTable__container">
              <div className="accountsTable__content">
                <h1 className="accountsTable__title">
                  {`${accountType} Accounts`}
                </h1>

                <AdminTableFilter
                  columnFilters={columnFilters}
                  setColumnFilters={setColumnFilters}
                />

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
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p>
                  Page {table.getState().pagination.pageIndex + 1} of{" "}
                  {table.getPageCount()}
                </p>
                <div className="buttonPagination">
                  {" "}
                  <button
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </button>
                  <button
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<"}
                  </button>
                  <button
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {">"}
                  </button>
                  <button
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {">>"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
