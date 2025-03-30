import React from 'react';
import { Button } from 'react-bootstrap';  // <-- Add this import
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Button as MUIButton } from '@mui/material';

const HomePage = () => {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <Row className="text-center">
                <Col md={6} className="my-5">
                    <h1>Welcome to TaskMaster</h1>
                    <p>A simple and effective tool to manage your tasks efficiently.</p>
                    <div className="d-flex justify-content-center gap-3">
                        <MUIButton variant="contained" color="primary" component={Link} to="/login" size="large">
                            Login
                        </MUIButton>
                        <MUIButton variant="outlined" color="primary" component={Link} to="/register" size="large">
                            Register
                        </MUIButton>
                       
                    </div>
                </Col>
                <Col md={6}>
                    {/* Illustration from undraw.co */}
                    <img
                        src="https://undraw.co/api/illustrations/undraw_task_completed_re_qzsf.svg"
                        alt="Task Management"
                        className="img-fluid"
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default HomePage;
