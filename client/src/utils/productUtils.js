// Utility functions for product calculations

/**
 * Calculate discounted price
 * @param {number} price - Original price
 * @param {number} discount - Discount percentage
 * @returns {string} - Discounted price with 2 decimal places
 */
export const getDiscountedPrice = (price, discount) => {
    if (!discount || discount === 0) return price.toFixed(2);
    return (price * (100 - discount) / 100).toFixed(2);
};

/**
 * Format price with currency symbol
 * @param {number} price - Price to format
 * @param {string} currency - Currency symbol (default: $)
 * @returns {string} - Formatted price
 */
export const formatPrice = (price, currency = '$') => {
    return `${currency}${parseFloat(price).toFixed(2)}`;
};

/**
 * Generate star rating display
 * @param {number} rating - Rating (0-5)
 * @returns {string} - Star string (★ for full, ☆ for empty)
 */
export const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 4.5);
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= fullStars ? '★' : '☆');
    }
    return stars.join('');
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid
 */
export const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

/**
 * Validate mobile number (10 digits)
 * @param {string} mobile - Mobile number
 * @returns {boolean} - Is valid
 */
export const isValidMobile = (mobile) => {
    return /^\d{10}$/.test(mobile);
};

/**
 * Get category icon
 * @param {string} categoryName - Category name
 * @returns {string} - Emoji icon
 */
export const getCategoryIcon = (categoryName) => {
    const name = categoryName?.toLowerCase() || '';
    if (name.includes('mobile') || name.includes('phone')) return '📱';
    if (name.includes('elect')) return '💻';
    if (name.includes('laptop')) return '💻';
    if (name.includes('fashion')) return '👕';
    if (name.includes('shoe')) return '👟';
    if (name.includes('watch')) return '⌚';
    if (name.includes('jewel')) return '💍';
    if (name.includes('bracelet')) return '📿';
    if (name.includes('bag')) return '👜';
    if (name.includes('sport')) return '🏀';
    if (name.includes('grocery')) return '🛒';
    return '🛍️';
};