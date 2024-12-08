// src/services/DataService.ts
import { BehaviorSubject } from 'rxjs';
import { ITaskResponse } from '../types/Tasks';
import api from './api';

class DataService {
    private tasksSubject = new BehaviorSubject<ITaskResponse>({
        count: 0,
        next: null,
        previous: null,
        results: [],
    });
    tasks = this.tasksSubject.asObservable();

    private idTaksSubject = new BehaviorSubject<number>(0)
    taskId = this.idTaksSubject.asObservable();

    async fetchAndSetTasks(token: string) {
        try {
            const response = await api.get('/tasks/', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            this.tasksSubject.next(response.data);
        } catch (error) {
            console.error('Error al cargar las tareas:', error);
            this.tasksSubject.next({
                count: 0,
                next: null,
                previous: null,
                results: [],
                errorMessage: 'Error al cargar las tareas. Por favor, intente nuevamente.',
            });
        }
    }

    fetchAndSetTaskId(taskId: number) {
        this.idTaksSubject.next(taskId)
    }

}

const dataService = new DataService();
export default dataService;
