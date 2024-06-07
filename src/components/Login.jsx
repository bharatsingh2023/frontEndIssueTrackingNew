import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
    const [showSignUp, setShowSignUp] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const [loginUsername, setLoginUsername] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [signUpName, setSignUpName] = useState('');
    const [signUpEmail, setSignUpEmail] = useState('');
    const [signUpPassword, setSignUpPassword] = useState('');

    const [forgotUsernameOrEmail, setForgotUsernameOrEmail] = useState('');

    const handleCloseSignUp = () => setShowSignUp(false);
    const handleShowSignUp = () => setShowSignUp(true);

    const handleCloseForgotPassword = () => setShowForgotPassword(false);
    const handleShowForgotPassword = () => setShowForgotPassword(true);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            username: loginUsername,
            password: loginPassword,
        };
        console.log('Login Data:', loginData);
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        const signUpData = {
            name: signUpName,
            email: signUpEmail,
            password: signUpPassword,
        };
        console.log('Sign Up Data:', signUpData);
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
        const forgotPasswordData = {
            usernameOrEmail: forgotUsernameOrEmail,
        };
        console.log('Forgot Password Data:', forgotPasswordData);
    };

    return (
        <Container fluid className='loginBg'>
            <Row className="justify-content-md-center">
                <Col md={6} lg={4}>
                    <div style={{
                        backgroundColor: 'rgba(211, 211, 211, 0.8)', // lightgrey with transparency
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)'
                    }}>
                        <h2 className="text-center">Login</h2>
                        <Form onSubmit={handleLoginSubmit}>
                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter username"
                                    value={loginUsername}
                                    onChange={(e) => setLoginUsername(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Enter password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                    required
                                />
                            </Form.Group>

                            <Button variant="primary" type="submit" className="w-100">
                                Login
                            </Button>

                            <div className="text-center mt-3">
                                <small>new user? </small>
                                <Button variant="link" onClick={handleShowSignUp}>
                                    Sign Up
                                </Button>
                            </div>

                            <div className="text-center mt-2">
                                <Button variant="link" onClick={handleShowForgotPassword}>
                                    Forgot Password?
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>

            <Modal show={showSignUp} onHide={handleCloseSignUp}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign Up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSignUpSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter full name"
                                value={signUpName}
                                onChange={(e) => setSignUpName(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={signUpEmail}
                                onChange={(e) => setSignUpEmail(e.target.value)}
                                required
                            />
                            <Form.Text className="text-muted">
                                We'll never share your email with anyone else.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                value={signUpPassword}
                                onChange={(e) => setSignUpPassword(e.target.value)}
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Verify Email and Submit
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseSignUp}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showForgotPassword} onHide={handleCloseForgotPassword}>
                <Modal.Header closeButton>
                    <Modal.Title>Forgot Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleForgotPasswordSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Username/Email</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter username or email"
                                value={forgotUsernameOrEmail}
                                onChange={(e) => setForgotUsernameOrEmail(e.target.value)}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Send OTP
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseForgotPassword}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Login;
