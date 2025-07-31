import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { AfterViewInit, booleanAttribute, Component, ElementRef, EventEmitter, forwardRef, Input, input, OnDestroy, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Dropdown } from './dropdown/dropdown';
import { BehaviorSubject, filter, Observable, take } from 'rxjs';

@Component({
  selector: 'ndp-search-bar',
  imports: [],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBar),
      multi: true
    }
  ]

})
export class SearchBar implements ControlValueAccessor, AfterViewInit, OnDestroy {

  protected searchTerm = '';
  protected showDropdown = false;

  data = input<{ key: any, value: string }[]>([])
  dropdownIcon = input(false, { transform: booleanAttribute });
  placeholder = input<string>('Buscar');

  @Input({ transform: booleanAttribute }) disableFilter = false;

  @Input({ transform: booleanAttribute }) ngDisabled = false;

  protected cId = this.generateRandomId();

  overlayRef!: OverlayRef;
  showError = input(false);

  @Input() value: { key: any, value: string } | null = null;
  @Output() valueChange = new EventEmitter<{ key: any, value: string }>();
  @Output() focus = new EventEmitter();

  @ViewChild('searchInput') inputRef!: ElementRef<HTMLInputElement>;
  private filteredItems$ = new BehaviorSubject<{ key: any, value: string }[]>([]);

  constructor(
    private overlay: Overlay,
    private vcr: ViewContainerRef
  ) { }

  ngAfterViewInit(): void {
    this.attachOverlay();
  }

  private onChange = (val: any) => { };
  private onTouched = () => { };


  writeValue(obj: any): void {
    if (typeof obj === 'string') {
      this.searchTerm = obj;

      this.filteredItems
        .pipe(filter(y => y.length == 1))
        .subscribe(y => {
          this.selectItem(y[0])          
        })
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void { }

  protected updateValue(item: { key: any, value: string }) {
    
    this.value = item
    this.valueChange.emit(this.value);
    this.onChange(this.value);

  }

  get filteredItems() {
    // console.log(this.disableFilter)
    if (!this.searchTerm || this.disableFilter) {
      this.filteredItems$.next(this.data());
      return this.filteredItems$.asObservable();
    }
    // console.log('pass')
    const filteredData = this.data().filter(item =>
      item.value.toLowerCase().includes(this.searchTerm.toLowerCase()));
    this.filteredItems$.next(filteredData);
    return this.filteredItems$.asObservable()
  }

  selectItem(item: { key: any, value: string }) {
    this.searchTerm = item.value;
    this.updateValue(item)
  }

  hideDropdownWithDelay() {
    setTimeout(() => {
      this.showDropdown = false;
    }, 150);
  }

  trackByFn(index: number) {
    return index;
  }

  private attachOverlay() {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.inputRef)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      backdropClass: 'cdk-overlay-transparent-backdrop'
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.hideDropdown();
    });
  }

  hideDropdown() {
    this.overlayRef?.detach();
    this.showDropdown = false;
  }

  toggleDropdown() {
    // console.log(this.ngDisabled)
    if (this.ngDisabled) return;

    if (this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
      this.showDropdown = false;
    } else {
      const portal = new ComponentPortal(Dropdown, this.vcr);
      const panelRef = this.overlayRef.attach(portal);

      this.filteredItems.subscribe(items => panelRef.instance.items = items);
      panelRef.instance.selectItem.subscribe(item => {
        this.selectItem(item);
        this.hideDropdown();
      });

      this.showDropdown = true;
    }
  }

  ngOnDestroy(): void {
    this.overlayRef?.dispose();
  }

  private generateRandomId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

}
