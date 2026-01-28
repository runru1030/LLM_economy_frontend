export interface paths {
    "/v1/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get Summary List */
        get: operations["get_summary_list_v1_summary_get"];
        put?: never;
        /** Create Project */
        post: operations["create_project_v1_summary_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/economy-agent/chat": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Chat
         * @description 실시간 대화
         */
        post: operations["chat_v1_economy_agent_chat_post"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/economy-agent/chat/{thread_id}/replay": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Replay Thread
         * @description 실시간 대화
         */
        post: operations["replay_thread_v1_economy_agent_chat__thread_id__replay_post"];
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
        /**
         * OrderBy
         * @enum {string}
         */
        OrderBy: "published_at" | "created_at";
        /** ReplayAnswerRequest */
        ReplayAnswerRequest: {
            /** Message Id */
            message_id?: string | null;
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
        /** TextMessage */
        TextMessage: {
            /**
             * @description discriminator enum property added by openapi-typescript
             * @enum {string}
             */
            type: "text";
            /**
             * Text
             * @description 텍스트 메시지입니다.
             */
            text: string;
        };
        /** ThreadRequest */
        ThreadRequest: {
            /**
             * Thread Id
             * @description 메시지를 전송할 채팅방 ID입니다. 없으면 새로운 채팅방을 생성합니다.
             */
            thread_id?: string | null;
            /**
             * Messages
             * @description 전송할 메시지입니다.
             */
            messages: components["schemas"]["TextMessage"][];
        };
        /** ThreadResponse */
        ThreadResponse: {
            /** Id */
            id: string;
            /**
             * Type
             * @enum {string}
             */
            type: "hm" | "am" | "amc" | "tm" | "thread_start" | "thread_end" | "thread_error" | "tool_start";
            /** Data */
            data: string | unknown[] | {
                [key: string]: unknown;
            };
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
    get_summary_list_v1_summary_get: {
        parameters: {
            query?: {
                /** @description 페이지 당 데이터 개수 */
                limit?: number;
                /** @description 페이지 인덱스 */
                offset?: number;
                /** @description 정렬 대상 */
                order_by?: components["schemas"]["OrderBy"];
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
    create_project_v1_summary_post: {
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
    chat_v1_economy_agent_chat_post: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ThreadRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
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
    replay_thread_v1_economy_agent_chat__thread_id__replay_post: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                thread_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReplayAnswerRequest"];
            };
        };
        responses: {
            /** @description Successful Response */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["ThreadResponse"];
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
