import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ITasks } from "../types/Tasks";
import { Subscription } from "rxjs";
import dataService from "../services/DataService";
import { readTask } from "../services/functions";

interface TaskModalProps {
    show: boolean;
    onClose: () => void;
    onSubmit: (task: ITasks, taskUpdate: boolean) => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ show, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("baja");
    const [endDate, setEndDate] = useState("");
    const [button, setTextButton] = useState("Crear")
    const [taskUpdate, setTaskUpdate] = useState(false)

    const handleSubmit = () => {
        if (!title || !description || !endDate) {
            alert("Por favor, complete todos los campos.");
            return;
        }

        const createDate = new Date();
        const endDateObj = new Date(endDate);

        /*         if (endDateObj < createDate) {
                    alert("La fecha de finalización no puede ser anterior a la fecha de creación.");
                    return;
                } */

        const task: ITasks = {
            title,
            description,
            priority,
            completed: false,
            create_date: createDate,
            end_date: endDateObj,
            status: "pending",
        };

        if (taskUpdate) {
            onSubmit(task, true)
            onClose();
        } else {
            onSubmit(task, false);
            onClose();
        }
    };

    useEffect(() => {
        const subscription: Subscription = dataService.taskId.subscribe(async (taskId) => {
            if (taskId != 0) {
                const data = await readTask(taskId);
                if (data) {
                    fillData(data)
                    setTaskUpdate(true)
                }
            } else {
                fillCleanData();
                setTaskUpdate(false)
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);

    function fillData(data: ITasks) {
        setTitle(data.title);
        setDescription(data.description);
        setPriority(data.priority);
        setTextButton("Actualizar");
    }

    function fillCleanData() {
        setTitle("");
        setDescription("");
        setPriority("baja");
        setTextButton("Crear");
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Crear Tarea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="taskTitle">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el título de la tarea"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="taskDescription" className="mt-3">
                        <Form.Label>Descripción</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Ingrese la descripción"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="taskPriority" className="mt-3">
                        <Form.Label>Prioridad</Form.Label>
                        <Form.Select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="baja">Baja</option>
                            <option value="media">Media</option>
                            <option value="alta">Alta</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group controlId="taskEndDate" className="mt-3">
                        <Form.Label>Fecha Límite</Form.Label>
                        <Form.Control
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    {button}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default TaskModal;

