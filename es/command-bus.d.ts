import { AnyCommandCreator, Command } from './command';
export declare type BusTarget = symbol | string | AnyCommandCreator;
export interface CommandListener {
    (command: Command): void;
}
export interface CommandCreatorListener<T extends AnyCommandCreator> {
    (command: ReturnType<T>): void;
}
export declare type CommandBus = ReturnType<typeof createCommandBus>;
export declare const WILDCARD = "*";
export declare function createCommandBus(): {
    dispatch: <T extends {
        type: string;
        payload: any;
    }>(command: T) => T;
    on: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    off: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    getListeners: (target: BusTarget) => Function[];
    addEventListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    removeEventListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    addListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
    removeListener: {
        <T extends string | symbol>(target: T, listener: CommandListener): CommandListener;
        <T extends {
            (): {
                type: string;
                payload: any;
            };
            type: string;
        } | {
            (value: any): {
                type: string;
                payload: any;
            };
            type: string;
        }>(target: T, listener: CommandCreatorListener<T>): CommandCreatorListener<T>;
    };
};
