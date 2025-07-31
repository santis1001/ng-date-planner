import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        if (!value) return null;

        const inputDate = new Date(value);
        const today = new Date();

        // Normalize both to 00:00 to ignore time component
        inputDate.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);

        return inputDate >= today ? null : { notTodayOrFuture: true };
    };
}
