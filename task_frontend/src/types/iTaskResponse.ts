

interface ITaskResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ITask[];
}