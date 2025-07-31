
export function toFormData(obj: any): FormData {
    const formData = new FormData();
    formData.append('data', JSON.stringify(obj)); // ✅ Wrap everything in a single key
    
    return formData;
}
