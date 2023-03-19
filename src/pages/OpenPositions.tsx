import React, { useState, useEffect } from 'react';
import { Container, Table, Button } from 'react-bootstrap';
import { useTable, useSortBy, useFilters } from "react-table";
import { Position } from '../../models/Position';
import './Positions.css';

const MAX_DIGITS = 2;

const OpenPositions: React.FC = () => {
    const [openPositions, setOpenPositions] = useState<any[]>([]);

  useEffect(() => {
    fetchOpenPositions();
  }, []);
  
  /*const fetchOpenPositions = async (updatePrices = false) => {
    const response = await fetch(`http://localhost:3001/positions/open?updatePrices=${updatePrices}`);
    const data = await response.json();
    if (data.positions) {
      setOpenPositions(data.positions);
    } else {
      setOpenPositions(data);
    }
  };*/

  const fetchOpenPositions = async (updatePrices = false) => {
    const response = await fetch(`http://localhost:3001/positions/open?updatePrices=${updatePrices}`);
    const data = await response.json();
    const positions = data.positions ? data.positions : data;
    setOpenPositions(positions);
    return positions;
  };  
  
  const updateCurrentPrices = async () => {
    const updatedPositions = await fetchOpenPositions(true);
    setOpenPositions(updatedPositions);
  };  

  const data = React.useMemo(() => openPositions, [openPositions]);

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
        Header: 'Shares',
        accessor: 'shares',
      },
      {
        Header: 'Buy Price',
        accessor: 'buyPrice',
      },
      {
        Header: "Buy Date",
        accessor: "buyDate",
        Cell: ({ value }) => new Date(value).toLocaleDateString(),
      },
      {
        Header: 'Total Cost',
        accessor: 'buyCost',
      },
      {
        Header: 'Current Price',
        accessor: 'currentPrice',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },      
      {
        Header: 'Stop Loss',
        accessor: 'stopLoss',
      },
      {
        Header: 'Adjusted Stop Loss',
        accessor: 'adjustedStopLoss',
      },
      {
        Header: 'Tags',
        accessor: 'buyTag',
      },
      {
        Header: 'Notes',
        accessor: 'buyNote',
      },
      {
        Header: 'Stop Loss Percentage',
        accessor: 'stopLossPercentage',
      },
      {
        Header: 'Adjusted Stop Loss Percentage',
        accessor: 'adjustedStopLossPercentage',
      },
      {
        Header: 'Max Potential Drawdown',
        accessor: 'maxDrawdown',
        Cell: ({ value }) => {
          return typeof value === "number"
            ? value.toFixed(MAX_DIGITS)
            : value.toString();
        },
      },
      {
        Header: 'Gain/Loss',
        accessor: 'gainLoss',
        Cell: ({ value }) => {
          return typeof value === "number"
            ? value.toFixed(MAX_DIGITS)
            : value.toString();
        },
      },
      {
        Header: 'Gain/Loss Percentage',
        accessor: 'gainLossPercentage',
        Cell: ({ value }) => {
          return `${Number(value).toFixed(MAX_DIGITS)}%`;
        },
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
    { columns, data, defaultColumn: { Filter: DefaultColumnFilter } },
    useFilters,
    useSortBy
  );

  return (
    <Container className="app-container">
      <h1> Open Positions</h1>
      <Table {...getTableProps()} striped bordered hover responsive className="text-center table">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                {...column.getHeaderProps({
                  onClick: (e) => {
                    if (e.target.tagName !== "INPUT") {
                      column.toggleSortBy();
                    }
                  },
                })}
              >
                {column.render("Header")}
                <div>{column.canFilter ? column.render("Filter") : null}</div>
              </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    <Button variant="primary" onClick={updateCurrentPrices}>
        Update Prices
    </Button>
    </Container>
  );
};

export default OpenPositions;

