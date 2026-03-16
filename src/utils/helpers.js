export const getCategoryName = (category) => {
    if (!category) return '';
    if (typeof category.name === 'string') return category.name;
    if (typeof category.name === 'object') {
    return category.name.en || category.name.ja || '';
    }
    return '';
};

export const getCategoryNameJa = (category) => {
    if (!category) return '';
    if (typeof category.name === 'object') {
    return category.name.ja || category.name.en || '';
    }
    return category.nameJa || '';
};