import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTable, useSortBy, usePagination } from 'react-table';
// import "react-table/react-table.css";
import "./ProcessedTable.css";
import Loader from './Loader/Loader';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

const Styles = styled.div`
  padding: 1rem;
  table {
    border-spacing: 0;
    ${'' /* border: 1px solid black; */}
    width:97%;
    background-color:white;
    border-radius:1%;
    margin:auto;
    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      ${'' /* border-bottom: 1px solid black;
      border-right: 1px solid black; */}
      :last-child {
        border-right: 0;
      }
    }
  }
`

function Table({ columns, data }) {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow } = useTable(
            {
                columns,
                data
            },
            useSortBy
        )

    // We don't want to render all 2000 rows for this example, so cap
    // it at 20 for this use case
    const firstPageRows = rows;

    return (
        <>
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                // Add the sorting props to control sorting. For this example
                                // we can add them into the header props
                                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                                    {column.render('Header')}
                                    {/* Add a sort direction indicator */}
                                    <span>
                                        {column.isSorted
                                            ? column.isSortedDesc
                                                ? ' 🔽'
                                                : ' 🔼'
                                            : ''}
                                    </span>
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {firstPageRows.map(
                        (row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        )
                                    })}
                                </tr>
                            )
                        }
                    )}
                </tbody>
            </table>
            <br />
        </>
    )
}

function ProcessedTable(props) {
    const columns = React.useMemo(
        () => [
            {
                Header: 'Students Enrolled',
                columns: [
                    {
                        Header: 'Student Address',
                        accessor: 'studentAddress'
                    },
                    {
                        Header: 'Files Uploaded',
                        accessor: 'filesUploaded'
                    },
                    {
                        Header: 'View',
                        accessor: 'view',
                        Cell: props => props.value == null || props.value == '-' ? <span>-</span> : <Link to={`/school/student/${props.value}`}>view</Link>
                    },
                ]
            }
        ],
        []
    )

    return (
        <Styles>
            <Table columns={columns} data={
                props.files.length == 0 ?
                    [{ studentAddress: '-', filesUploaded: '-' }] :
                    props.files} />
        </Styles>
    )
}

const mapStateToProps = (state) => {
    return {
        files: state.files,
        students: state.students,
        length: state.files.length
    }
}

export default connect(mapStateToProps)(ProcessedTable);