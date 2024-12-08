export interface ITasks {
    id?: number,
    title: string,
    description: string,
    priority: string,
    completed: boolean,
    create_date: Date,
    end_date: Date,
    status: string,
}

export interface ITaskResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ITasks[];
    errorMessage?: string;
}