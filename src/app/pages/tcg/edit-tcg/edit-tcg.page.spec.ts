import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTCGPage } from './edit-tcg.page';

describe('EditTCGPage', () => {
    let component: EditTCGPage;
    let fixture: ComponentFixture<EditTCGPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(EditTCGPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
