import { Injectable, signal } from '@angular/core';
import { BackupStep, BackupStepStatusEnum } from './models/backupStep';

@Injectable({
    providedIn: 'root',
})
export abstract class BackupService {
    protected _stepProgression = signal<number>(0);
    protected _currentStep = signal<BackupStep>(new BackupStep(""));
    protected _countStep = signal<number>(0);

    readonly stepProgression = this._stepProgression.asReadonly();
    readonly currentStep = this._currentStep.asReadonly();
    readonly countStep = this._countStep.asReadonly();

    protected backupSteps: BackupStep[] = [];

    constructor() {}

    protected updateStepProgression(backupStepStatusEnum: BackupStepStatusEnum): void{
        this._currentStep?.update((backupStep: BackupStep) => {
            backupStep.statusText = backupStepStatusEnum;

            return {...backupStep};
        });
    }

    protected loadStepProgression(): void{
        this._stepProgression.set((this.currentStep()?.stepOrder ?? 0 * 100) / this.countStep());
    }

    protected resetStepProgression(): void{
        this._stepProgression.set(0);
    }
}
