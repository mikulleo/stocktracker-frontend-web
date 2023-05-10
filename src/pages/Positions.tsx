// Positions page
import React, { useState, useEffect, useRef } from 'react';
import { Container, Table, Button, Modal, Form } from 'react-bootstrap';
import { useTable, useSortBy, useFilters } from "react-table";
import { Alert } from 'react-bootstrap';
import { Position } from '../../models/Position';
import '../App.css';
import './Positions.css';
import '../index.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MAX_DIGITS = 2;

const Positions: React.FC = () => {
  const [buyOrders, setBuyOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Position | null>(null);
  const sellPriceRef = useRef<any>();
  const sellDateRef = useRef<any>();
  const sellTagRef = useRef<any>();
  const sellNoteRef = useRef<any>();
  const commissionRef = useRef<any>();
  const [showAlert, setShowAlert] = useState(false);
  const [showModifyModal, setShowModifyModal] = useState(false);
  const modifyFormRef = useRef<any>();
  const [showReduceModal, setShowReduceModal] = useState(false);
  const reduceSharesRef = useRef<any>();
  const sharesToCloseRef = useRef<any>();

  useEffect(() => {
    fetchBuyOrders();
  }, []);

  const normalizedGainLossPercentage = (status, initialShares, buyPrice, buyCost, fullPositionSize, gainLossPercentage) => {
    if (fullPositionSize !== null && fullPositionSize !== 0) {
      if (status == "Closed") {
        return ( ((initialShares * buyPrice) / fullPositionSize) * gainLossPercentage );
      }
      else {
        return (buyCost / fullPositionSize) * gainLossPercentage;
      }
      
    }
    return null;
  };
  

  const fetchBuyOrders = async () => {
    const response = await fetch('http://localhost:3001/positions');
    const data = await response.json();

    setBuyOrders(data);
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (order) => {
    if (order.status === 'Closed') {
      toast.warn('This position is already closed.');
    } else {
      setSelectedOrder(order);
      setShowModal(true);
    }
  };

  const handleShowModifyModal = (order) => {
    setSelectedOrder(order);
    setShowModifyModal(true);
  };
  
  const handleCloseModifyModal = () => setShowModifyModal(false);

  /*const handleShowReduceModal = (order) => {
    setSelectedOrder(order);
    setShowReduceModal(true);
  };*/

  const handleCloseReduceModal = () => setShowReduceModal(false);

  const handleSaveChanges = async () => {
    // You should validate the form data before sending it to the backend
    const sellPrice = parseFloat(sellPriceRef?.current?.value || "0");
    const sellDate = sellDateRef?.current?.value;
    const sellTag = sellTagRef?.current?.value;
    const sellNote = sellNoteRef?.current?.value;
    const commission = parseFloat(commissionRef?.current?.value || "0");
    const sharesToClose = parseFloat(sharesToCloseRef?.current?.value || "0");
  
    if (selectedOrder) {
      const response = await fetch(`http://localhost:3001/positions/${selectedOrder._id}/close`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sharesToClose,
          sellPrice,
          sellDate,
          sellTag,
          sellNote,
          commission,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Position closed:', data);
        toast.success('Position closed successfully!');
        setSelectedOrder(null);
        handleCloseModal();
        // Refresh the positions list
        fetchBuyOrders();
      } else {
        console.error('Error closing position');
        toast.error('Error closing position');
      }
    } else {
      console.error('No position selected');
    }
  };

  const handleModifyChanges = async () => {
      // You should validate the form data before sending it to the backend
      const formData = new FormData(modifyFormRef.current);
    
      if (selectedOrder) {
    
        const response = await fetch(`http://localhost:3001/positions/${selectedOrder._id}/modify`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
    
        if (response.ok) {
          const data = await response.json();
          console.log('Position modified:', data);
          toast.success('Position modified successfully!');
          setSelectedOrder(null);
          handleCloseModifyModal();
          // Refresh the positions list
          fetchBuyOrders();
        } else {
          console.error('Error modifying position');
          toast.error('Error modifying position');
        }
      } else {
        console.error('No position selected');
      }
    };  

    /*const handleReducePosition = async () => {
    const reduceShares = parseInt(reduceSharesRef?.current?.value || "0");

    if (selectedOrder && reduceShares > 0) {
      const response = await fetch(
        `http://localhost:3001/positions/${selectedOrder._id}/reduce`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reduceShares,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("Position reduced:", data);
        toast.success("Position reduced successfully!");
        setSelectedOrder(null);
        handleCloseReduceModal();
        // Refresh the positions list
        fetchBuyOrders();
      } else {
        console.error("Error reducing position");
        toast.error("Error reducing position");
      }
    } else {
      console.error("No position selected or invalid number of shares");
    }
  };*/
  
  const data = React.useMemo(() => buyOrders, [buyOrders]);

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
      Header: 'Total Buy Cost',
      accessor: 'initialBuyCost',
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
      Header: 'Action',
      accessor: '_id',
      Cell: ({ row }) => (
        <td className="action-buttons">
          <Button variant="warning" onClick={() => handleShowModal(row.original)} >
            Close or Reduce
          </Button>{" "}
          <Button variant="info" onClick={() => handleShowModifyModal(row.original)} >
            Modify
          </Button>
        </td>
      ),
    },    
    {
      Header: "Status",
      accessor: "status",
      Cell: ({ value }) => <span className={value === "Open" ? "open" : "closed"}>{value}</span>,
    },   
    {
      Header: "Normalized Gain/Loss %",
      accessor: "normalizedGainLossPercentage",
      Cell: ({ row }) => {
        const { status, initialShares, buyPrice, buyCost, fullPositionSize, gainLossPercentage } = row.original;
        const percentage = normalizedGainLossPercentage(status, initialShares, buyPrice, buyCost, fullPositionSize, gainLossPercentage);
        if (percentage !== null) {
          return `${percentage.toFixed(2)}%`;
        } else {
          return '-';
        }
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
      Header: 'Gain/Loss',
      accessor: 'gainLoss',
      Cell: ({ value }) => {
        return typeof value === "number"
          ? value.toFixed(MAX_DIGITS)
          : value.toString();
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
    <h1>Positions</h1>
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
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Close Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="sharesToClose">
              <Form.Label>Shares to Close or Reduce</Form.Label>
              <Form.Control type="number" step="1" min="1" ref={sharesToCloseRef} />
            </Form.Group>
            <Form.Group controlId="sellPrice">
              <Form.Label>Sell Price</Form.Label>
              <Form.Control type="number" step="0.01" ref={sellPriceRef} />
            </Form.Group>
            <Form.Group controlId="sellDate">
              <Form.Label>Sell Date</Form.Label>
              <Form.Control type="date" ref={sellDateRef} />
            </Form.Group>
            <Form.Group controlId="sellTag">
              <Form.Label>Sell Tag</Form.Label>
              <Form.Control as="select" ref={sellTagRef}>
                <option value="">Choose...</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
                <option value="tag3">Tag 3</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="sellNote">
              <Form.Label>Sell Note</Form.Label>
              <Form.Control type="text" placeholder="Enter a custom note" ref={sellNoteRef} />
            </Form.Group>
            <Form.Group controlId="commission">
              <Form.Label>Commission</Form.Label>
              <Form.Control type="number" step="0.01" ref={commissionRef} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showModifyModal} onHide={handleCloseModifyModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modify Position</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form ref={modifyFormRef}>
            <Form.Group controlId="shares">
              <Form.Label>Shares</Form.Label>
              <Form.Control
                type="number"
                defaultValue={selectedOrder?.shares || ""}
                name="shares"
              />
            </Form.Group>
            <Form.Group controlId="buyPrice">
              <Form.Label>Buy Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                defaultValue={selectedOrder?.buyPrice || ""}
                name="buyPrice"
              />
            </Form.Group>
            <Form.Group controlId="buyDate">
              <Form.Label>Buy Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={selectedOrder?.buyDate ? new Date(selectedOrder.buyDate).toISOString().split("T")[0] : ""}
                name="buyDate"
              />
            </Form.Group>
            <Form.Group controlId="buyTag">
              <Form.Label>Buy Tag</Form.Label>
              <Form.Control as="select" defaultValue={selectedOrder?.buyTag || ""} name="buyTag">
                <option value="">Choose...</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
                <option value="tag3">Tag 3</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="sellPrice">
              <Form.Label>Sell Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                defaultValue={selectedOrder?.sellPrice || ""}
                name="sellPrice"
              />
            </Form.Group>
            <Form.Group controlId="sellDate">
              <Form.Label>Sell Date</Form.Label>
              <Form.Control
                type="date"
                defaultValue={selectedOrder?.sellDate ? new Date(selectedOrder.sellDate).toISOString().split("T")[0] : ""}
                name="sellDate"
              />
            </Form.Group>
            <Form.Group controlId="sellTag">
              <Form.Label>Sell Tag</Form.Label>
              <Form.Control as="select" defaultValue={selectedOrder?.sellTag || ""} name="sellTag">
                <option value="">Choose...</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
                <option value="tag3">Tag 3</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="commission">
              <Form.Label>Commission</Form.Label>
              <Form.Control type="number" step="0.01" ref={commissionRef} />
            </Form.Group>
            <Form.Group controlId="stopLoss">
              <Form.Label> Stop Loss</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                defaultValue={selectedOrder?.stopLoss || ""}
                name="stopLoss"
              />
            </Form.Group>
            <Form.Group controlId="adjustedStopLoss">
              <Form.Label>Adjusted Stop Loss</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                defaultValue={selectedOrder?.adjustedStopLoss || ""}
                name="adjustedStopLoss"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModifyModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleModifyChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </Container>
  );
};

export default Positions;
