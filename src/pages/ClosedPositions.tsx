// Closed Positions Page
import React, { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { useTable, useSortBy, useFilters } from "react-table";
import { Position } from '../../models/Position';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as XLSX from 'xlsx';
import "../App.css";
import "./Positions.css";
import "../index.css";
import '../App.css';
import './Positions.css';
import '../index.css';

const MAX_DIGITS = 2;

interface ClosedPositionsProps {
  partialReductionsFilter?: Position["_id"];
}

const ClosedPositions: React.FC<ClosedPositionsProps> = ({ partialReductionsFilter }) => {
  const [closedPositions, setClosedPositions] = useState([]);

  useEffect(() => {
    fetchClosedPositions();
  }, []);

  const fetchClosedPositions = async () => {
    const response = await fetch('http://localhost:3001/positions/closed');
    const data = await response.json();
    setClosedPositions(data);
  };

  const [importedClosedPositions, setImportedClosedPositions] = useState([]);

  const processClosedPositions = async (closedPositions) => {
    // Remove the header row from the data
    const dataWithoutHeader = closedPositions.slice(1);
    let successCount = 0;
    let errorCount = 0;
  
    for (const entry of dataWithoutHeader) {
      // Convert the entry to an object to send to the backend
      const position = {
        positionType: entry[5], // Assuming the 'Position Type' is at index 5
        stockSymbol: entry[0],
        shares: entry[2],
        buyPrice: entry[1],
        buyDate: entry[3],
        stopLoss: entry[4],
        buyTag: entry[7],
        buyNote: entry[6],
        commission: entry[8],
        fullPositionSize: entry[9],
        sellPrice: entry[10],
        sellDate: entry[11],
        sellNote: entry[12],
        sellTag: entry[13],
        status: 'Closed',
      };

      console.log(position);
  
      // Send the entry to the backend
      const response = await fetch('http://localhost:3001/positions/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(position),
      });

      if (response.ok) {
        successCount++;
        const data = await response.json();
        
      } else {
        errorCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`${successCount} position(s) imported successfully.`);
    }

    if (errorCount > 0) {
      toast.error(`${errorCount} position(s) failed to import.`);
    }
  };
  
          
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result || "";
      const workbook = XLSX.read(data, { type: 'binary' });

      const closedPositionsWorksheet = workbook.Sheets['ClosedPositions'];

      if (closedPositionsWorksheet) {
    
        const closedPositionsData = XLSX.utils.sheet_to_json(closedPositionsWorksheet, { header: 1 });
          processClosedPositions(closedPositionsData);
      } else {
        alert('Closed Positions sheet not found.');
      }
    
    };
    reader.readAsBinaryString(file);
  };

  const data = React.useMemo(() => {
    if (partialReductionsFilter) {
      return closedPositions.filter((position) => position._id === partialReductionsFilter);
    }
      return closedPositions;
    }, [closedPositions, partialReductionsFilter]);
    
    const DefaultColumnFilter = ({
        column: { filterValue, setFilter },
      }) => {
      return (
      <input value={filterValue || ""} onChange={(e) => {
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
            return row.positionType === 'short'
              ? row.gainLossPercentage / ((1 - row.stopLoss / row.buyPrice) * -100)
              : row.gainLossPercentage / ((row.stopLoss / row.buyPrice - 1) * -100);
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
          <label className="btn btn-primary">
            Import from Excel
            <input type="file" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
          <ToastContainer />
        </Container>
      );
    
      };

      export default ClosedPositions;
      