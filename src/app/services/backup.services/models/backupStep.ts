export class BackupStep {
    constructor(name: string, successText: string, errorText: string, stepOrder: number = 0, action?: Function) {
        this.name = name;
        this.successText = successText;
        this.errorText = errorText;
        this.stepOrder = stepOrder;
        this.action = action;
    }

    name!: string;
    successText!: string;
    errorText!: string;
    stepOrder: number = 0; 
    action?: Function;
}
