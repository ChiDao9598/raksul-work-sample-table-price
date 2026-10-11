import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaperSizeSelector } from './paper-size-selector';
import { PaperSize } from '../../models/price.model';

describe('PaperSizeSelector', () => {
  let fixture: ComponentFixture<PaperSizeSelector>;
  let el: HTMLElement;
  let emitted: PaperSize[];

  const select = () => el.querySelector<HTMLSelectElement>('select')!;
  const hint = () => el.querySelector('.hint')!.textContent!.trim();

  const choose = (size: PaperSize) => {
    select().value = size;
    select().dispatchEvent(new Event('change'));
    fixture.detectChanges();
  };
  const clickApply = () => {
    el.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperSizeSelector],
    }).compileComponents();

    fixture = TestBed.createComponent(PaperSizeSelector);
    el = fixture.nativeElement;
    emitted = [];
    fixture.componentInstance.apply.subscribe((size) => emitted.push(size));

    fixture.componentRef.setInput('value', 'A4');
    fixture.detectChanges();
  });

  it('lists A4, A5, B4 and B5', () => {
    const options = Array.from(select().options).map((o) => o.value);
    expect(options).toEqual(['A4', 'A5', 'B4', 'B5']);
  });

  it('selects the current value', () => {
    expect(select().value).toBe('A4');
  });

  it('does not emit when only the dropdown changes', () => {
    choose('B5');
    expect(emitted).toEqual([]);
  });

  it('shows a hint while the chosen size is not applied yet', () => {
    expect(hint()).toBe('');

    choose('B5');
    expect(hint()).toBe('Click Apply to show B5 prices');
  });

  it('emits the chosen size when Apply is clicked', () => {
    choose('A5');
    clickApply();

    expect(emitted).toEqual(['A5']);
  });

  it('emits the current size when Apply is clicked without a change', () => {
    clickApply();
    expect(emitted).toEqual(['A4']);
  });

  it('resets the draft and hides the hint when the applied value changes from outside', () => {
    choose('B4');
    fixture.componentRef.setInput('value', 'B4');
    fixture.detectChanges();

    expect(select().value).toBe('B4');
    expect(hint()).toBe('');
  });
});
