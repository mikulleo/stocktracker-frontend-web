import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

<ToastContainer />

interface FormData {
  stockSymbol: string;
  shares: string;
  buyPrice: string;
  buyDate: string;
  stopLoss: string;
  buyTag: string;
  buyNote: string;
  commission: string;
}

const AddNewEntry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    stockSymbol: '',
    shares: '',
    buyPrice: '',
    buyDate: '',
    stopLoss: '',
    buyTag: '',
    buyNote: '',
    commission: '',
  });
  const [currentFullPositionSize, setCurrentFullPositionSize] = useState<number>(0);
  
  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value } as Pick<FormData, keyof FormData>);
  };

  useEffect(() => {
    // Fetch the latest full position size from the backend
    fetch('http://localhost:3001/api/full-position-size')
    .then((response) => response.json())
    .then((data) => setCurrentFullPositionSize(data.current_full_position_size));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:3001/positions/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stockSymbol: formData.stockSymbol,
        shares: formData.shares,
        buyPrice: formData.buyPrice,
        buyDate: formData.buyDate,
        stopLoss: formData.stopLoss,
        buyTag: formData.buyTag,
        buyNote: formData.buyNote,
        commission: formData.commission,
        fullPositionSize: currentFullPositionSize,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Buy Order added:', data);
      toast.success('Buy order added successfully!');
      // Clear the form after a successful submission
      setFormData({
        stockSymbol: '',
        shares: '',
        buyPrice: '',
        buyDate: '',
        stopLoss: '',
        buyTag: '',
        buyNote: '',
        commission: '',
      });
    } else {
      console.error('Error adding buy order');
    }
  };

  return (
    <Container className="app-container">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col>
            <Form.Group controlId="stockSymbol">
              <Form.Label>Stock Symbol</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter stock symbol"
                name="stockSymbol"
                value={formData.stockSymbol}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="shares">
              <Form.Label>Shares</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of shares"
                name="shares"
                value={formData.shares}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="buyPrice">
              <Form.Label>Buy Price</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter buy price"
                name="buyPrice"
                value={formData.buyPrice}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="date">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="buyDate"
                value={formData.buyDate}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="stopLoss">
              <Form.Label>Stop Loss</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                placeholder="Enter stop loss"
                name="stopLoss"
                value={formData.stopLoss}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                as="select"
                name="buyTag"
                value={formData.buyTag}
                onChange={handleChange}
              >
                <option value="">Choose...</option>
                <option value="tag1">Tag 1</option>
                <option value="tag2">Tag 2</option>
                <option value="tag3">Tag 3</option>
              </Form.Control>
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="note">
              <Form.Label>Note</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter a custom note"
                name="buyNote"
                value={formData.buyNote}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="commission">
              <Form.Label>Commission</Form.Label>
              <Form.Control
                type="text"
                placeholder=""
                name="commission"
                value={formData.commission}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="fullPositionSize">
              <Form.Label>Full Pos Size</Form.Label>
              <Form.Control
                type="number"
                readOnly
                name="fullPositionSize"
                value={currentFullPositionSize}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group className="d-flex align-items-end">
              <Button className="btn btn-primary btn-add-buy" variant="primary" type="submit">
                Add Buy
              </Button>
              </Form.Group>
          </Col>
        </Row>
      </Form>
      <ToastContainer />
    </Container>
  );
};

export default AddNewEntry;

