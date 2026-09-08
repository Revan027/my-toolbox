export class BackupStep {
    constructor(name: string, stepOrder: number = 0, action?: Function) {
        this.name = name;
        this.stepOrder = stepOrder;
        this.action = action;
    }

    name!: string;
    statusText?: string;
    stepOrder: number = 0; 
    action?: Function;
}

export enum BackupStepStatusEnum {
    Error = "Une erreur est survenue",
    Pending = "En cours",
    Success = "Terminée",
}