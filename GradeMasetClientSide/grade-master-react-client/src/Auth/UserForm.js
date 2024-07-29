import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Alert, Card } from 'react-bootstrap';

//Login 
const UserForm = ({ onLogin }) => { //Send the func 'onLogin' to the component

  //Form Data
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');

  //Events
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    //Invoke the method to upper component (Activate the func. like pointer to func)
    const errorMessage = await onLogin(email, password, role); 
    if (errorMessage) {
      setError(errorMessage);
    }
  };
  

  return (
    <Card className="p-4" style={{ minWidth: '300px' }}>
      <Card.Body>
        <h2 className="text-center mb-4">Log in</h2>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant='danger'>{error}</Alert>}

          <Form.Group controlId='formEmail' className='mb-3'>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type='email'
              placeholder='Enter your email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='formPassword' className='mb-3'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Enter your password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId='formRole' className='mb-3'>
            <Form.Label>Role</Form.Label>
            <Form.Control
              as='select'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value=''>Select Role</option>
              <option value='student'>Student</option>
              <option value='teacher'>Teacher</option>
            </Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='w-100'>
            Log in
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default UserForm;
