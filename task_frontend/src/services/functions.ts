import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import api from "./api";

export function progressBar(text: string): void {
    const MySwal = withReactContent(Swal);
    let timerInterval: number;

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