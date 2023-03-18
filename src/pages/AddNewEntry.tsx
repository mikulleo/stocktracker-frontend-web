import React, { useState } from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';

interface FormData {
  stockSymbol: string;
  shares: string;
  buyPrice: string;
  date: string;
  tags: string;
}

const AddNewEntry: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    stockSymbol: '',
    shares: '',
    buyPrice: '',
    date: '',
    tags: '',
  });

  const handleChange = (event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value } as Pick<FormData, keyof FormData>);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const totalCost = parseFloat(formData.shares) * parseFloat(formData.buyPrice);
    console.log('Total cost:', totalCost);
    // Add your logic to save the form data and total cost
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
              <Form.Label>Number of Shares</Form.Label>
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
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="tags">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                as="select"
                name="tags"
                value={formData.tags}
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
            <Form.Group className="d-flex align-items-end">
              <Button variant="primary" type="submit">
                Add Buy
              </Button>
              </Form.Group>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AddNewEntry;

