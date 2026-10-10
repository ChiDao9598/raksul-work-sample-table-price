import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceTable } from './price-table';

describe('PriceTable', () => {
  let component: PriceTable;
  let fixture: ComponentFixture<PriceTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTable],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
