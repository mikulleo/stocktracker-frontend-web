import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useTable, useSortBy, useFilters } from "react-table";
import { Position } from '../../models/Position';
import '../App.css';
import './Positions.css';
import '../index.css';

const MAX_DIGITS = 2;

const ClosedPositions: React.FC = () => {
  const [closedPositions, setClosedPositions] = useState([]);

  useEffect(() => {
    fetchClosedPositions();
  }, []);

  const fetchClosedPositions = async () => {
    const response = await fetch('http://localhost:3001/positions/closed');
    const data = await response.json();
    setClosedPositions(data);
  };

  const data = React.useMemo(() => closedPositions, [closedPositions]);

  const DefaultColumnFilter = ({
    column: { filterValue, setFilter },
  }) => {
    return (
      <input
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined);
        }}
        placeholder={``}
        className="form-control"
        style={{ fontSize: '12px', marginTop: '8px' }}
      />
    );
  };

  const columns = React.useMemo(
    () => [
      {
        Header: 'Symbol',
        accessor: 'stockSymbol',
      },
      {
        Header: 'Buy Price',
        accessor: 'buyPrice',
      },
      {
        Header: 'Shares',
        accessor: 'shares',
      },
      {
        Header: 'Total Cost',
        accessor: 'buyCost',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: "Buy Date",
        accessor: "buyDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Sell Price',
        accessor: 'sellPrice',
        Cell: ({ value }) => (value || '-'),
      },
      {
        Header: 'Sell Date',
        accessor: 'sellDate',
        Cell: ({ value }) => (value ? new Date(value).toLocaleDateString() : '-'),
      },
      {
        Header: 'Sell Cost',
        accessor: 'sellCost',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: 'Sell Tag',
        accessor: 'sellTag',
      },
      {
        Header: 'Notes',
        accessor: 'sellNote',
        Cell: ({ value }) => (
          value ? (
            <button className="btn btn-primary btn-sm" onClick={() => alert(value)}>
              View Note
            </button>
          ) : (
            "No Note"
          )
        ),
      },
      {
        Header: 'Normalized Gain/Loss %',
        accessor: 'normalizedGainLossPercentage',
        Cell: ({ value }) => {
          const cellClass = value > 0 ? 'positive-value' : 'negative-value';
          return (
            <div className="value-container">
              <span className={cellClass}>
                {value ? `${value.toFixed(MAX_DIGITS)}%` : '-'}
              </span>
            </div>
          );
        },
      },
      {
        Header: 'Gain/Loss Percentage',
        accessor: 'gainLossPercentage',
        Cell: ({ value }) => (value ? `${value.toFixed(MAX_DIGITS)}%` : '-'),
      },
      {
        Header: 'Gain/Loss',
        accessor: 'gainLoss',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: 'Stop Loss',
        accessor: 'stopLoss',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: 'R/R',
        id: 'RvsR',
        accessor: (row) => {
          if (row.stopLoss && row.stopLoss !== 0) {
            return row.gainLossPercentage / ((row.stopLoss/row.buyPrice - 1)*-100);
          }
          return null;
        },
        Cell: ({ value }) => {
          const cellClass = value > 0 ? 'positive-value' : 'negative-value';
          return (
            <div className="value-container">
              <span className={cellClass}>
                {value ? value.toFixed(MAX_DIGITS) : '-'}
              </span>
            </div>
          );
        },
      },
      {
        Header: 'Commission',
        accessor: 'commission',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      ],
      []
      );
      
      const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        state,
        setFilter,
      } = useTable(
        {
          columns,
          data,
          defaultColumn: { Filter: DefaultColumnFilter },
        },
        useFilters,
        useSortBy
      );
      
      return (
        <Container className="ClosedPositions">
          <h3 className="text-center">Closed Positions</h3>
          <Table {...getTableProps()} striped bordered hover size="sm">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
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
              {rows.map((row, i) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Container>
      );
      
      };
      
      export default ClosedPositions;
      