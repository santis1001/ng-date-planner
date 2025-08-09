export function getContrastingTextColor(hexColor: string): 'white' | 'black' {
    // Remove '#' if present
    const hex = hexColor.replace('#', '');

    // Parse r, g, b from hex
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    // Apply sRGB luminance formula
    const [R, G, B] = [r, g, b].map(c => {
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    const luminance = 0.2126 * R + 0.7152 * G + 0.0722 * B;

    // Use white text if background is dark, black otherwise
    // console.log(`Hex Color: ${hexColor}, Luminance: ${luminance}`);
    
    return luminance < 0.5 ? 'white' : 'black';
}