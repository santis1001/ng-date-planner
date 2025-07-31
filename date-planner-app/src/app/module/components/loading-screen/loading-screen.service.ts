import { OverlayRef, Overlay } from "@angular/cdk/overlay";
import { ComponentPortal } from "@angular/cdk/portal";
import { Injectable } from "@angular/core";
import { LoadingScreen } from "./loading-screen";

@Injectable({ providedIn: 'root' })
export class LoadingScreenService {
    private overlayRef: OverlayRef | null = null;
    private activeRequests = 0;

    constructor(private overlay: Overlay) { }

    show(): void {
        this.activeRequests++;

        if (!this.overlayRef) {
            this.overlayRef = this.overlay.create({
                hasBackdrop: true,
                backdropClass: 'cdk-overlay-dark-backdrop',
                positionStrategy: this.overlay.position()
                    .global()
                    .centerHorizontally()
                    .centerVertically()
            });

            const loadingPortal = new ComponentPortal(LoadingScreen);
            this.overlayRef.attach(loadingPortal);
        }
    }

    hide(): void {
        this.activeRequests = Math.max(0, this.activeRequests - 1);
        if (this.activeRequests === 0 && this.overlayRef) {
            this.overlayRef.detach();
            this.overlayRef = null;
        }
    }
}
