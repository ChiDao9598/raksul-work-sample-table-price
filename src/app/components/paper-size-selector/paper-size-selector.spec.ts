import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaperSizeSelector } from './paper-size-selector';

describe('PaperSizeSelector', () => {
  let component: PaperSizeSelector;
  let fixture: ComponentFixture<PaperSizeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperSizeSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(PaperSizeSelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
