import React, { useState, useEffect } from "react";

type Usuarios = {
    id: string;
    name: string;
    email: string;
}

const Usuarios = () => {

    const [usuarios, setUsuarios] = useState<Usuarios[]>([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const obtenerUsuarios = async () => {
            try {
                setCargando(true)
                const respuesta = await fetch('https://jsonplaceholder.typicode.com/users');
                if (!respuesta.ok) {
                    throw new Error('Error al obtener los usuarios');
                }
                const datos = await respuesta.json();
                setUsuarios(datos)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setCargando(false)
            }
        }
        obtenerUsuarios();
    }, []);

    if (cargando) return <p>Cargando usuarios...</p>;
    if (error) return <p>Error: {error}</p>

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <ul>
                {usuarios.map((usuario) => (
                    <li key={usuario.id}>
                        <strong>{usuario.name}</strong> - {usuario.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Usuarios;