import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConvertPage } from './convert.page';

describe('ConvertPage', () => {
    let component: ConvertPage;
    let fixture: ComponentFixture<ConvertPage>;

    beforeEach(() => {
        fixture = TestBed.createComponent(ConvertPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
