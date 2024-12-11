import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "./api";
import dataService from "./DataService";
import { ITasks } from "../types/Tasks";

export function progressBar(text: string): void {
    const MySwal = withReactContent(Swal);
    let timerInterval: ReturnType<typeof setInterval>;

    MySwal.fire({
        title: text,
        html: 'un momento por favor.',
        timer: 2000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
            const timerElement = Swal.getHtmlContainer()?.querySelector("b");
            if (timerElement) {
                timerInterval = setInterval(() => {
                    timerElement.textContent = `${Swal.getTimerLeft()}`;
                }, 100);
            }
        },
        willClose: () => {
            clearInterval(timerInterval); // Limpia el intervalo al cerrar
        }
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
            console.log("Alerta cerrada automáticamente por el temporizador");
        }
    });

}

export function alertError(texto: string) {
    Swal.fire({
        icon: "error",
        title: "Oops...",
        text: texto,
    });
}

export async function handleChangePassword(newPassword: string) {
    const token = localStorage.getItem('token');

    try {
        const response = await api.put(
            '/accounts/change-password/',
            { new_password: newPassword },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Contraseña actualizada:', response.data);
        alert('Tu contraseña ha sido cambiada exitosamente');
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        alert('Error al cambiar la contraseña. Inténtalo nuevamente.');
    }
};

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

export async function deleteTask(taskId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem("token");

        await api.delete(`/tasks/${taskId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (token) {
            dataService.fetchAndSetTasks(token);
        }
        return true

    } catch (error) {
        console.error("Error al eliminar la tarea:", error);
        return false
    }
}

export async function editTask(taskId: number): Promise<boolean> {
    try {
        const token = localStorage.getItem("token");

        await api.put(`/tasks/${taskId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        if (token) {
            dataService.fetchAndSetTasks(token);
        }
        return true

    } catch (error) {
        return false
    }
}

export async function readTask(taskId: number): Promise<ITasks> {
    try {
        const token = localStorage.getItem("token");

        const response = await api.get(`/tasks/${taskId}/`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
        });

        return response.data;
    } catch (error) {
        throw error;
    }
}

export function changeStatus(status: string): string {
    let statusChange = ""

    if (status === 'pending') {
        statusChange = "Pendiente";
    }
    else if (status === 'in_progress') {
        statusChange = "En Progreso";
    }
    else if (status === 'completed') {
        statusChange = "Completada";
    }
    return statusChange
}