import { Component, EventEmitter, Output, signal, ViewContainerRef, TemplateRef, ViewChild, Input } from '@angular/core';
import { Card } from "@AppModule/contents/card/card";
import { TemplatePortal } from '@angular/cdk/portal';
import {
  Overlay,
  OverlayRef,
  OverlayPositionBuilder
} from '@angular/cdk/overlay';

@Component({
  selector: 'ndp-date-options',
  imports: [Card],
  templateUrl: './date-options.html',
  styleUrl: './date-options.css'
})
export class DateOptions {

  @Output() deleteClick = new EventEmitter<void>();
  @Output() modifyClick = new EventEmitter<{value: string, color: string}>();
  @Output() colorClick = new EventEmitter<void>();
  @Input() label: string = '';

  protected showOptions = false;
  private overlayRef: OverlayRef | null = null;

  @ViewChild('menuTemplate') menuTemplateRef!: TemplateRef<any>;

  constructor(
    private overlay: Overlay,
    private overlayPositionBuilder: OverlayPositionBuilder,
    private vcr: ViewContainerRef
  ) { }

  protected toggleOptions() {
    this.showOptions = !this.showOptions;
  }

  get isMenuOpen(): boolean {
    return this.showOptions;
  }

  openMenu(origin: HTMLElement) {
    this.showOptions = true;
    if (this.overlayRef) {
      this.closeMenu();
      return;
    }

    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(origin)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.backdropClick().subscribe(() => this.closeMenu());

    const portal = new TemplatePortal(this.menuTemplateRef, this.vcr);
    this.overlayRef.attach(portal);
  }

  closeMenu() {
    this.overlayRef?.detach();
    this.overlayRef = null;
    this.showOptions = false;
  }

}
