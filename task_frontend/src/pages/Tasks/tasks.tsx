import { useEffect, useMemo, useState } from 'react'
import { Row, Col, Card, Button } from 'react-bootstrap'
import { MaterialReactTable, MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { ITasks } from '../../types/Tasks';
import { Subscription } from 'rxjs';
import dataService from '../../services/DataService';
import TaskModal from '../../components/TaskModal';
import api from '../../services/api';
import { changeStatus, deleteTask, editTask, formatDate } from '../../services/functions';
import { MRT_Localization_ES } from 'material-react-table/locales/es';
import { Pencil, Trash } from 'react-bootstrap-icons';
import './task.css';
import Swal from 'sweetalert2';

const Tasks: React.FC = () => {
    const [data, setDataTask] = useState<ITasks[]>([])
    const [showCard, setShowCard] = useState<boolean>(false)
    const [showModal, setShowModal] = useState<boolean>(false)

    const columns = useMemo<MRT_ColumnDef<ITasks>[]>(
        () => [
            /*             {
                            accessorKey: "title",
                            header: "Título",
                            muiTableHeadCellProps: { style: { color: "#AA5486" } },
                            enableHiding: false,
                            enableSorting: false,
                            enableFiltering: false,
                        }, */
            {
                accessorKey: "description",
                header: "Descripción",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
                enableSorting: false,
                enableFiltering: false,
            },
            {
                accessorKey: "priority",
                header: "Prioridad",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
            },
            {
                accessorKey: "create_date",
                header: "Fecha Inicio",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
                Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            },
            {
                accessorKey: "end_date",
                header: "Fecha Fin",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
                Cell: ({ cell }) => formatDate(cell.getValue<string>()),
            },
            {
                accessorKey: "status",
                header: "Status",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
                Cell: ({ cell }) => changeStatus(cell.getValue<string>())
            },
            {
                accessorKey: "actions",
                header: "Acciones",
                muiTableHeadCellProps: { style: { color: "#AA5486" } },
                enableHiding: false,
                enableSorting: false,
                enableFiltering: false,
                Cell: ({ row }) => (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                            onClick={() => handleUpdateTask(row.original.id!)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "#007bff",
                            }}
                        >
                            <Pencil size={18} />
                        </button>
                        <button
                            className='actions-trash'
                            onClick={() => handleDeleteTaks(row.original.id!)}
                        >
                            <Trash size={18} />
                        </button>
                    </div>
                ),
            },
        ],
        []
    );

    const table = useMaterialReactTable<ITasks>({
        columns,
        data,
        enableRowSelection: true,
        enableColumnOrdering: false,
        enableGlobalFilter: false,
        localization: MRT_Localization_ES,
        initialState: {
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
        },
    });

    useEffect(() => {
        const subscription: Subscription = dataService.tasks.subscribe((tasksData) => {
            const taskResults = tasksData?.results || [];
            setDataTask(taskResults);

            if (taskResults.length > 0) {
                setShowCard(true);
            } else {
                setShowCard(false);
            }
        });
        return () => {
            subscription.unsubscribe();
        };
    }, []);


    const handleCreateTask = async (task: ITasks, taskUpdate: boolean) => {
        try {
            const token = localStorage.getItem("token");
            if (taskUpdate) {
                const subscription: Subscription = dataService.taskId.subscribe(async (taskId) => {
                    editTask(taskId)
                });
                return () => {
                    subscription.unsubscribe();
                };
            } else {
                await api.post(
                    "/tasks/",
                    task,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
                if (token) {
                    await dataService.fetchAndSetTasks(token);
                }
            }

        } catch (error) {
            console.error("Error al guardar la tarea:", error);
        }
    };

    const handleDeleteTaks = async (taskId: number) => {
        Swal.fire({
            title: "Confirma que deseas eliminar esta tarea",
            showCancelButton: true,
            confirmButtonText: "Eliminar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const result = await deleteTask(taskId)
                if (result) {
                    Swal.fire("Tarea eliminada", "", "success");
                } else {
                    Swal.fire("Error al eliminar la tarea", "", "error");
                }
            }
        });
    }

    const handleUpdateTask = async (taskId: number) => {
        dataService.fetchAndSetTaskId(taskId)
        setShowModal(true)
    }


    return (
        <section className='content'>
            <div className='mb-4'>
                <Row>
                    <h2>Tareas</h2>
                </Row>
                <Row>
                    <Col xs md className='d-flex flex-column justify-content-end align-items-end'>
                        <div>
                            <Button variant='outline-success' onClick={() => setShowModal(true)}>Crear tarea</Button>
                        </div>
                    </Col>
                </Row>
            </div>
            <Row>
                <Col>
                    {showCard ? (
                        <Card className='shadow'>
                            <MaterialReactTable
                                table={table} />
                        </Card>
                    ) : (
                        <div className='d-flex justify-content-center'>
                            <h3 className='text-secondary'>No tienes tareas creadas.</h3>
                        </div>
                    )}
                </Col>
            </Row>
            <TaskModal
                show={showModal}
                onClose={() => { setShowModal(false); dataService.fetchAndSetTaskId(0) }}
                onSubmit={handleCreateTask}
            />
        </section>
    )
}

export default Tasks