import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuiviTCGPage } from './suivi-tcg.page';

describe('SuiviTCGPage', () => {
    let component: SuiviTCGPage;
    let fixture: ComponentFixture<SuiviTCGPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(SuiviTCGPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
