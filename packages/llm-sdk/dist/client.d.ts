import { ChatOptions, ChatResult } from './types';
export declare function startSDK(): void;
export declare function stopSDK(): Promise<void>;
export declare function chat(options: ChatOptions): Promise<ChatResult>;
