export interface paths {
    "/v1/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Summary List V5 */
        get: operations["get_summary_list_v5_v1_summary_get"];
        put?: never;
        /** Create Project V5 */
        post: operations["create_project_v5_v1_summary_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** CreateSummaryData */
        CreateSummaryData: {
            /**
             * Title
             * @default
             */
            title: string;
            /**
             * Author
             * @default
             */
            author: string;
            /**
             * Url
             * @default
             */
            url: string;
            /**
             * Content
             * @default
             */
            content: string;
            /** Keywords */
            keywords: string[];
            /** Published At */
            published_at: string;
        };
        /** HTTPValidationError */
        HTTPValidationError: {
            /** Detail */
            detail?: components["schemas"]["ValidationError"][];
        };
        /** SummaryGetResponse */
        SummaryGetResponse: {
            /** Id */
            id: number;
            /** Title */
            title: string;
            /** Content */
            content: string;
            /** Keywords */
            keywords: string[];
            /** Author */
            author: string;
            /** Url */
            url: string | null;
            /**
             * Published At
             * Format: date-time
             */
            published_at: string;
            /**
             * Created At
             * Format: date-time
             */
            created_at: string;
        };
        /** SummaryGetResponseWithPagination */
        SummaryGetResponseWithPagination: {
            /** Total */
            total: number;
            /** Offset */
            offset: number;
            /** Limit */
            limit: number;
            /** Asc */
            asc: boolean;
            /** Summaries */
            summaries: components["schemas"]["SummaryGetResponse"][];
        };
        /** SummaryListCreateData */
        SummaryListCreateData: {
            /** Summary List */
            summary_list: components["schemas"]["CreateSummaryData"][];
        };
        /** ValidationError */
        ValidationError: {
            /** Location */
            loc: (string | number)[];
            /** Message */
            msg: string;
            /** Error Type */
            type: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    get_summary_list_v5_v1_summary_get: {
        parameters: {
            query?: {
                /** @description 페이지 당 데이터 개수 */
                limit?: number;
                /** @description 페이지 인덱스 */
                offset?: number;
                /** @description 오름차순 정렬 여부 */
                asc?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["SummaryGetResponseWithPagination"];
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
    create_project_v5_v1_summary_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SummaryListCreateData"];
            };
        };
        responses: {
            /** @description Successful Response */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": unknown;
                };
            };
            /** @description Validation Error */
            422: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["HTTPValidationError"];
                };
            };
        };
    };
}
