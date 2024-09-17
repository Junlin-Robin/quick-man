export enum TaskType {
    CASTEP = 'CASTEP',
    GAUSSIAN = 'GAUSSIAN',
}

export enum CASTEP_FILETYPE {
    CELL = '.cell',
    CASTEP = '.castep',
}

export enum GAUSSIAN_FILETYPE {
    CHK = '.chk',
}


export enum TaskStatus {
    WAITING = 0,
    RUNNING = 1,
    SUCCESS = 2,
    FAILED = 3,
}