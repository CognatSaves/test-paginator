import { MainStore } from "./mainStore";

export interface Stores {
    [key: string]: any;
}

export const stores: Stores = { 
    mainStore: new MainStore(),
};