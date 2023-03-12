/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */

import { ApiResponse, Message } from 'typegram';
export type TgPhotoMessage = ApiResponse<Message.PhotoMessage>;

import FormData from 'form-data';

type LoggingMethod = (...message: any[]) => void; // from 'loglevel'
export interface IConsoleLogger {
    trace: LoggingMethod; // 0
    debug: LoggingMethod; // 1
    info: LoggingMethod;  // 2
    warn: LoggingMethod;  // 3
    error: LoggingMethod; // 4
}


export type TPostOptions<T> = {
    url: string;
    formData: FormData;
    headers?: T
};


export type TgUploadOptions = {
    chat_id: number;
    token: string;
    apiRoot?: string;
};
