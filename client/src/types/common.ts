export namespace Common {

    /** 資料表格標頭 */
    export interface DataTableHeader<T> {
        key?: 'data-table-group' | 'data-table-select' | 'data-table-expand' | (string & {});
        value?: string | ((item: T) => any);
        title?: string;
        fixed?: boolean;
        align?: 'start' | 'end' | 'center';
        minWidth?: string;
        maxWidth?: string;
        sortable?: boolean;
    }
}
