import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { Person, Key } from 'react-bootstrap-icons';
import { motion } from 'framer-motion';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { progressBar } from '../services/functions';

const Login: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            progressBar("Verificando")
            const response = await api.post('/login/', {
                username, password
            });

            if (response.status === 200) {
                const token = response.data.access
                localStorage.setItem('token', token);
                navigate('/dashboard/tasks')
            }
        } catch (error) {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "No encontramos tu registro."
            });
        }
    }


    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}>
            <Container fluid className="vh-100 vw-100 p-0">
                <Row className="w-100 h-100 g-0">
                    <Col
                        md={7}
                        className="d-flex flex-column align-items-center justify-content-center h-100 p-5">
                        <h1 className="mb-5 text-color-primary text-logo">Uola</h1>
                        <h4 className="mb-5 text-color-primary">Accede a tu cuenta</h4>
                        <Form className="w-75" onSubmit={handleLogin}>
                            <InputGroup className="mb-5">
                                <InputGroup.Text>
                                    <Person />
                                </InputGroup.Text>
                                <Form.Control type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </InputGroup>

                            <InputGroup className="mb-5">
                                <InputGroup.Text>
                                    <Key />
                                </InputGroup.Text>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </InputGroup>
                            <Button
                                variant="outline-secondary"
                                type="submit"
                                className="color-btn-secondary w-50 mx-auto d-block">
                                Entrar
                            </Button>
                        </Form>
                    </Col>
                    <Col
                        md={5}
                        className="d-flex flex-column align-items-center justify-content-center h-100 bg-pink">
                        <h1 className="text-white mb-5">¡Un gusto conocerte!</h1>
                        <p className="text-white p-4 text-small text-center mb-5">
                            Organiza tus tareas fácilmente y simplifica tu vida. ¡Has llegado al lugar perfecto!
                        </p>
                        <Link to="/register" className="btn btn-outline-light btn-lg">
                            Regístrate
                        </Link>
                    </Col>
                </Row>
            </Container>
        </motion.div>
    );
};

export default Login;
