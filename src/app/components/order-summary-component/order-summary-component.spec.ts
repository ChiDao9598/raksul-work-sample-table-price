import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderSummaryComponent } from './order-summary-component';

describe('OrderSummaryComponent', () => {
  let fixture: ComponentFixture<OrderSummaryComponent>;
  let el: HTMLElement;

  const orderPrice = () => el.querySelector('strong')!.textContent!.trim();
  const cartButton = () => el.querySelector<HTMLButtonElement>('button')!;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrderSummaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OrderSummaryComponent);
    el = fixture.nativeElement;
    fixture.componentRef.setInput('paperSize', 'A4');
  });

  it('shows "-" and disables Cart when no price is selected', () => {
    fixture.detectChanges();

    expect(orderPrice()).toBe('-');
    expect(cartButton().disabled).toBe(true);
  });

  it('shows the selected price formatted with commas and enables Cart', () => {
    fixture.componentRef.setInput('price', 1820);
    fixture.componentRef.setInput('selected', { quantity: 300, businessDay: 3 });
    fixture.detectChanges();

    expect(orderPrice()).toBe('VND 1,820');
    expect(cartButton().disabled).toBe(false);
  });

  it('goes back to "-" when the selection is cleared', () => {
    fixture.componentRef.setInput('price', 1820);
    fixture.detectChanges();

    fixture.componentRef.setInput('price', null);
    fixture.detectChanges();

    expect(orderPrice()).toBe('-');
  });
});
