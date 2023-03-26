import React, { useState, useEffect } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { useTable, useSortBy, useFilters } from "react-table";
import { Position } from "../../models/Position";
import "../App.css";
import "./Positions.css";
import "../index.css";

const MAX_DIGITS = 2;

interface PositionWithAdjustment extends Position {
  isAdjusted: boolean;
}

type ModalContentState = {
  stopLoss: number | null;
  initialRisk: number | null;
  isAdjusted: boolean | null;
  rowData: Partial<Position> & {
    initialRisk: number | null;
    adjustedRisk: number | null;
    isAdjusted: boolean | null;
  } | null;
};

const OpenPositions: React.FC = () => {
  const [openPositions, setOpenPositions] = useState<PositionWithAdjustment[]>([]);
  const [fetchedPositions, setFetchedPositions] = useState<PositionWithAdjustment[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContentState>({
    stopLoss: null,
    initialRisk: null,
    isAdjusted: null,
    rowData: null,
  });

  useEffect(() => {
    console.log("First use effect - Open Positions:", openPositions);
    console.log("First use effect - Previous Open Positions:", openPositions);
  }, [openPositions]);

  const toggleStopLossClick = (rowId) => {
    setOpenPositions((prevState) => {
      const updatedPositions = prevState.map((position) => {
        if (position._id === rowId) {
          const isAdjusted = !position.isAdjusted;
          return { ...position, isAdjusted };
        }
        return position;
      });
      return updatedPositions;
    });
  };  

  const fetchOpenPositions = async (updatePrices = false) => {
    const response = await fetch(
      `http://localhost:3001/positions/open?updatePrices=${updatePrices}`
    );
    const data = await response.json();

    if (!data || (Array.isArray(data) && data.length === 0)) {
      console.error("No data received from the API.");
      return;
    }

    const positions = data.positions ? data.positions : data;
    const positionsWithAdjustment = positions.map((position: Position) => ({
      ...position,
      isAdjusted:
        position.adjustedStopLoss !== null &&
        position.adjustedStopLoss !== undefined &&
        position.adjustedStopLoss !== 0,
    }));
    console.log("Fetched positions - positionsWithAdjustment:", positionsWithAdjustment);
    return positionsWithAdjustment;
  };

  useEffect(() => {
    async function fetchData() {
      const fetchedPositions = await fetchOpenPositions(true);
      console.log("Second use effect - Open Positions:", openPositions);
      console.log("Second use effect - Fetched Positions:", fetchedPositions);
      setFetchedPositions([...fetchedPositions]);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (fetchedPositions.length > 0) {
      setOpenPositions(fetchedPositions);
    }
  }, [fetchedPositions]);

  const updateCurrentPrices = async () => {
    const updatedPositions = await fetchOpenPositions(true);
  };

  const normalizedGainLossPercentage = (buyCost, fullPositionSize, gainLossPercentage) => {
    if (fullPositionSize !== null && fullPositionSize !== 0) {
      return (buyCost / fullPositionSize) * gainLossPercentage;
    }
    return null;
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
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: 'Current Price',
        accessor: 'currentPrice',
        Cell: ({ value }) => (value ? value.toFixed(MAX_DIGITS) : '-'),
      },
      {
        Header: 'Stop Loss',
        accessor: (row: PositionWithAdjustment) => {
          return row.isAdjusted && row.adjustedStopLoss
            ? row.adjustedStopLoss
            : row.stopLoss;
        },
        Cell: ({ row }) => {
          const { initialRisk, stopLoss, adjustedStopLoss, adjustedRisk } = row.original;
          const isAdjusted = row.original.isAdjusted;
          const value = isAdjusted ? adjustedStopLoss : stopLoss;
          const buttonClass = isAdjusted ? "adjusted-tag" : "original-tag";
          return (
            <div className="value-container">
              {value.toFixed(MAX_DIGITS)}{" "}
              {adjustedStopLoss && (
                <button
                className={buttonClass}
                  onClick={() => toggleStopLossClick(row.original._id)}
                >
                  {isAdjusted ? "A" : "O"}
                </button>
              )}
            </div>
          );
        },        
      },
      {
        Header: 'Risk',
        accessor: (row: PositionWithAdjustment) => {
          return row.isAdjusted ? row.adjustedRisk : row.initialRisk;
        },
        Cell: ({ row }) => {
          const { initialRisk, stopLoss, adjustedStopLoss, adjustedRisk } = row.original;
          const isAdjusted = row.original.isAdjusted;
          const value = isAdjusted ? adjustedRisk : initialRisk;
          return (
            <>
                {`${Number(value).toFixed(MAX_DIGITS)}%`}
            </>
          );
        },
      },
      {
        Header: 'Tags',
        accessor: 'buyTag',
      },
      {
        Header: 'Notes',
        accessor: 'buyNote',
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
      {
        Header: "Normalized Gain/Loss %",
        accessor: "normalizedGainLossPercentage",
        Cell: ({ row }) => {
          const { buyCost, fullPositionSize, gainLossPercentage } = row.original;
          const percentage = normalizedGainLossPercentage(buyCost, fullPositionSize, gainLossPercentage);
          if (percentage !== null) {
            return `${percentage.toFixed(2)}%`;
          } else {
            return '-';
          }
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
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.original._id}>
                {row.cells.map((cell) => {
                  return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
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