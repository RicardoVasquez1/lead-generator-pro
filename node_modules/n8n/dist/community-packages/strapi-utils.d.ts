export interface Entity<T> {
    id: number;
    attributes: T;
}
export declare function paginatedRequest<T>(url: string): Promise<T[]>;
