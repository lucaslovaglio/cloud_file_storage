import {CloudProvider} from "./provider/provider.interface";

export interface File {
    name: string;
    content: string;
}

export interface FilesListItem {
    name: string;
    size: number;
}

export interface UploadOperation {
    data: File;
    result: void;
}
