import React, { useState } from 'react';
import api from '../services/api.ts'
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Envelope, Key, Person } from 'react-bootstrap-icons';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { progressBar } from '../services/functions.ts';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [usernameError, setUsernameError] = useState("");
    //const [emailError, setEmailError] = useState("");
    const MySwal = withReactContent(Swal)
    const navigate = useNavigate();
    const [registro] = useState<boolean>(false)

    const handleUsernameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUserName = e.target.value;
        setUsername(newUserName)
        console.log("Nuevo username:", username);
        try {
            const response = await api.get('/accounts/check-username/', {
                params: { username: newUserName },
            });

            if (response.data.exists) {
                setUsernameError("El username no se encuentra disponible");
            } else {
                setUsernameError("");
            }

            return response.data.exists;
        } catch (error) {
            setUsernameError(`Error: ${error}`);
            return false;
        }
    };

    /*     const checkEmail = async (email: string) => {
            try {
                const response = await api.get('/check-username/', {
                    params: { email }
                });
                return response.data.exists;
            } catch (error) {
                console.error("Error al verificar el username:", error);
                return false;
            }
        } */

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        progressBar("Registrando...")

        try {
            const response = await api.post('/register/', {
                username,
                password,
                email,
            });

            if (response.status === 201) {
                navigate('/')
            }
        } catch (error) {
            MySwal.fire({
                icon: "error",
                title: "Oops...",
                text: "Hubo algú problema en tu registro."
            });
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.3 }}>
            <Container fluid className="vh-100 vw-100 p-0">
                <Row className="w-100 h-100 g-0">
                    <Col
                        md={5}
                        className="d-flex flex-column align-items-center justify-content-center h-100 bg-pink">
                        <h1 className="text-white mb-5">Ya tienes una cuenta?</h1>
                        <p className="text-white p-4 text-small text-center mb-5">
                            Inicia sesión y empieza a organizar todas tus tareas!
                        </p>
                        <Link to="/" className="btn btn-outline-light btn-lg">
                            Sign in
                        </Link>
                    </Col>
                    <Col
                        md={7}
                        className="d-flex flex-column align-items-center justify-content-center h-100 p-5">
                        <h1 className="mb-5 text-color-primary text-logo">Uola</h1>
                        <h4 className="mb-2 text-color-primary">Registro</h4>
                        <Form className="w-75" onSubmit={handleRegister}>
                            <p className='error-message'>{usernameError}</p>
                            <InputGroup className="mb-4">
                                <InputGroup.Text>
                                    <Person />
                                </InputGroup.Text>
                                <Form.Control type="text" placeholder="Username" value={username}
                                    onChange={handleUsernameChange} />
                            </InputGroup>
                            <InputGroup className="mb-4">
                                <InputGroup.Text>
                                    <Envelope />
                                </InputGroup.Text>
                                <Form.Control type="email" placeholder="Email" value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                            </InputGroup>

                            <InputGroup className="mb-4">
                                <InputGroup.Text>
                                    <Key />
                                </InputGroup.Text>
                                <Form.Control type="password" placeholder="Password" value={password}
                                    onChange={(e) => setPassword(e.target.value)} />
                            </InputGroup>
                            <Button
                                variant="outline-secondary"
                                type="submit"
                                className="color-btn-secondary w-50 mx-auto d-block"
                                disabled={registro}>
                                Registrarme
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </motion.div>

    );
};

export default Register;
