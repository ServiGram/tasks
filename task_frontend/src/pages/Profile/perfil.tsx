import React, { useState, useEffect } from 'react';
import './perfil.css';
import api from '../../services/api';
import { Pencil, Person } from 'react-bootstrap-icons';
import { Button, Card, Col, Form, FormGroup, Row } from 'react-bootstrap';
import { handleChangePassword, alertError } from '../../services/functions';

const Perfil: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [profilePicture, setProfilePicture] = useState<string | null>(null);
    const [editPicture, setEditPicture] = useState(false);
    const [editName, setEditName] = useState(false);
    const [editAddress, setEditAddress] = useState(false);
    const [editPhone, setEditPhone] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [repeatNewPassword, setRepeatNewPassword] = useState('');

    // Cargar los datos del usuario actual
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token')
            try {
                const response = await api.get('/accounts/me/', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const userData = response.data;
                setName(userData.full_name || 'Nombre de Usuario');
                setUsername(userData.username || '');
                setEmail(userData.email || '');
                setAddress(userData.address || '');
                setPhone(userData.phone || '');
                setProfilePicture(userData.profile_picture)
            } catch (error) {
                console.error('Error al cargar el perfil:', error);
            }
        };

        fetchProfile();
    }, []);

    // Actualizar los datos del perfil
    const handleUpdateProfile = async (fieldName: string, value: string) => {
        const formData = new FormData();
        formData.append(fieldName, value);
        const token = localStorage.getItem('token');

        try {
            const response = await api.put('/accounts/me/update/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Perfil actualizado:', response.data);
        } catch (error) {
            console.error('Error al actualizar el perfil:', error);
        }
    };

    const handleUpdatePicture = async (file: File) => {
        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('profile_picture', file);

        try {
            await api.put('/accounts/me/update/', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setProfilePicture(URL.createObjectURL(file));
            setEditPicture(false)
        } catch (error) {
            console.error('Error al actualizar la foto de perfil:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword == repeatNewPassword) {
            handleChangePassword(newPassword);
        } else {
            alertError("Las contraseñas no son iguales.")
        }
    };




    return (
        <section>
            <div>
                <h3 className='mb-5'><Person></Person> Perfil</h3>
            </div>
            <div className="content">
                <Row className='mb-3'>
                    <Col xs md lg='8'>
                        <Card className='p-3 shadow'>
                            <Row className='card-profile'>
                                <Col xs md='4' lg='4'>
                                    <div className="profile-container">
                                        <div className="profile-picture shadow">
                                            <img
                                                src={profilePicture || "../src/assets/images/default-profile.jpg"}
                                                alt="Profile"
                                                className="profile-img"
                                            />
                                        </div>
                                        {!editPicture ? (
                                            <button
                                                className="btn"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setEditPicture(true);
                                                }}
                                            >
                                                <Pencil />
                                            </button>
                                        ) : (
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        console.log('Archivo seleccionado:', file.name);
                                                        handleUpdatePicture(file);
                                                    }
                                                }}
                                            />
                                        )}
                                    </div>
                                </Col>
                                <Col xs md lg='8'>
                                    <form>
                                        <label className="label-form mb-4">
                                            {!editName ? (
                                                <>
                                                    <h3>{name}</h3>
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setEditName(true);
                                                        }}
                                                    >
                                                        <Pencil />
                                                    </button>
                                                </>
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Escribe tu nombre"
                                                    value={name}
                                                    autoFocus
                                                    onChange={(e) => setName(e.target.value)}
                                                    onBlur={() => {
                                                        setEditName(false);
                                                        handleUpdateProfile('full_name', name)
                                                    }}
                                                />
                                            )}
                                        </label>

                                        <label className='label-form'>
                                            <p className='text-secondary'>Username: </p>
                                            <p>{username}</p>
                                        </label>

                                        <label className='label-form'>
                                            <p className='text-secondary'>Email:</p>
                                            <p>{email}</p>
                                        </label>

                                        <label className='label-form'>
                                            <p className='text-secondary'>País:</p>
                                            {!editAddress ? (
                                                <>
                                                    <p>{address}</p>
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setEditAddress(true);
                                                        }}
                                                    >
                                                        <Pencil />
                                                    </button>
                                                </>
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    value={address}
                                                    autoFocus
                                                    onChange={(e) => setAddress(e.target.value)}
                                                    onBlur={() => {
                                                        setEditAddress(false);
                                                        handleUpdateProfile('address', address)
                                                    }}
                                                />
                                            )}
                                        </label>

                                        <label className='label-form'>
                                            <p className='text-secondary'>Teléfono:</p>
                                            {!editPhone ? (
                                                <>
                                                    <p>{phone}</p>
                                                    <button
                                                        className="btn"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setEditPhone(true);
                                                        }}
                                                    >
                                                        <Pencil />
                                                    </button>
                                                </>
                                            ) : (
                                                <Form.Control
                                                    type="text"
                                                    value={phone}
                                                    autoFocus
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    onBlur={() => {
                                                        setEditPhone(false);
                                                        handleUpdateProfile('phone', phone)
                                                    }}
                                                />
                                            )}
                                        </label>
                                    </form>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col xs md='4' lg='4'>
                        <Card className='p-3 shadow'>
                            <Row className='card-profile'>
                                <h5>Tareas Recientes: </h5>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col xs={12} md={12} lg={8}>
                        <Card className='p-3 shadow'>
                            <h4 className='mb-4'>Cambiar contraseña</h4>
                            <Form onSubmit={handleSubmit}>
                                <FormGroup>
                                    <Row className="g-2">
                                        <Col xs={12} md={6}>
                                            <Form.Control
                                                placeholder="Nueva contraseña"
                                                type="password"
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </Col>
                                        <Col xs={12} md={6}>
                                            <Form.Control
                                                placeholder="Repita contraseña"
                                                type="password"
                                                onChange={(e) => setRepeatNewPassword(e.target.value)}
                                            />
                                        </Col>
                                    </Row>
                                </FormGroup>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button type="submit" variant="outline-dark" size="sm">Cambiar</Button>
                                </div>
                            </Form>
                        </Card>
                    </Col>
                </Row>

            </div>
        </section>
    );
};

export default Perfil;
