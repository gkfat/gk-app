export const loadMarkdownFile = async (fileName: string) => {
    try {
        const res = await fetch(fileName);

        if (!res.ok) {
            throw new Error('load md file error');
        }

        const text = await res.text();
        return text;
    } catch (err) {
        console.error('Error loading markdown, ', err);
        return '';
    }
};
