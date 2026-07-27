export function parseProductImages(images?: string | null): string[] {
    if (!images) return ['/placeholder-carpet.jpg'];
    try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed) && parsed.length > 0) {
            const valid = parsed.filter((url): url is string => typeof url === 'string' && url.trim().length > 0);
            if (valid.length > 0) return valid;
        }
    } catch {
        // Fallback if not JSON string
    }

    if (images.includes(',')) {
        const list = images.split(',').map(s => s.trim()).filter(Boolean);
        if (list.length > 0) return list;
    }

    if (images.includes('\n')) {
        const list = images.split('\n').map(s => s.trim()).filter(Boolean);
        if (list.length > 0) return list;
    }

    return images.trim() ? [images.trim()] : ['/placeholder-carpet.jpg'];
}

export function getFirstProductImage(images?: string | null): string {
    const list = parseProductImages(images);
    return list[0] || '/placeholder-carpet.jpg';
}
