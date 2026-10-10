export function formatPrice(value: number): string {
    if(!Number.isSafeInteger(value) || value < 1) {
        throw new RangeError(`FormatPrice expects a positive integer, received: ${value}`)
    }

    const digits = String(value);
    let rs = '';

    for (let i = 0; i < digits.length; i++) {
        const remaining = digits.length - i;
        rs += digits[i];
        if(remaining > 1 && (remaining -1) % 3 === 0) {
            rs += ','
        }
    }
    return rs;
}