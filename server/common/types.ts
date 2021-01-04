export interface CorsOption {
    origin: boolean
}

export type CallBack = (arg0: null, arg1: CorsOption) => void

export interface UserInfo {
    username: string;
    password: string;
}

/**
 * 文章管理 相关请求参数类型定义
 * */
export interface QueryListOptions {
    pageNo: number; // 当前页码
    pageSize: number; // 每页数量
    range?: string;
}
export interface RecordIdOptions {
    id: number;
    uid: string;
}

export interface AddRecordOptions {
    title: string;
    tag: string;
    introduce: string;
    content: string;
    cover: string;
}

export interface UpdateRecordOptions extends AddRecordOptions {
    id: number;
    uid: string;
}
