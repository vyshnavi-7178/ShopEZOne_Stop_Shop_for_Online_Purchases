import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getDiscountedPrice, renderStars } from '../../utils/productUtils';

const SearchResults = () => {
    const location = useLocation();
    const { products = [], query = '' } = location.state || {};

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '40px auto',
            padding: '0 20px'
        },
        header: {
            marginBottom: '30px'
        },
        title: {
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '10px',
            color: '#333'
        },
        resultCount: {
            fontSize: '16px',
            color: '#666'
        },
        productsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
        },
        productCard: {
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'transform 0.3s'
        },
        productImage: {
            position: 'relative',
            height: '200px',
            overflow: 'hidden'
        },
        image: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
        },
        discountBadge: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '600'
        },
        productInfo: {
            padding: '15px'
        },
        productTitle: {
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '5px',
            color: '#333'
        },
        productBrand: {
            fontSize: '14px',
            color: '#666',
            marginBottom: '5px'
        },
        productRating: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '10px'
        },
        stars: {
            color: '#ffc107'
        },
        productPrice: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '10px'
        },
        currentPrice: {
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#667eea'
        },
        originalPrice: {
            fontSize: '14px',
            color: '#999',
            textDecoration: 'line-through'
        },
        noResults: {
            textAlign: 'center',
            padding: '50px',
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        },
        backLink: {
            color: '#667eea',
            textDecoration: 'none',
            display: 'inline-block',
            marginTop: '20px'
        }
    };

    if (!products || products.length === 0) {
        return (
            <div style={styles.container}>
                <div style={styles.noResults}>
                    <h3>No results found for "{query}"</h3>
                    <p>Try different keywords or browse our categories</p>
                    <Link to="/" style={styles.backLink}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Search Results</h1>
                <p style={styles.resultCount}>
                    Found <strong>{products.length}</strong> results for "{query}"
                </p>
            </div>

            <div style={styles.productsGrid}>
                {products.map(product => (
                    <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        style={styles.productCard}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={styles.productImage}>
                            <img
                                src={product.mainImg}
                                alt={product.title}
                                style={styles.image}
                                onError={(e) => {
                                    e.target.src = 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?w=400';
                                }}
                            />
                            {product.discount > 0 && (
                                <span style={styles.discountBadge}>
                                    -{product.discount}%
                                </span>
                            )}
                        </div>
                        <div style={styles.productInfo}>
                            <h3 style={styles.productTitle}>{product.title}</h3>
                            {product.brand && (
                                <p style={styles.productBrand}>{product.brand}</p>
                            )}
                            <div style={styles.productRating}>
                                <span style={styles.stars}>
                                    {renderStars(product.rating)}
                                </span>
                                <span>({product.rating})</span>
                            </div>
                            <div style={styles.productPrice}>
                                <span style={styles.currentPrice}>
                                    ${getDiscountedPrice(product.price, product.discount)}
                                </span>
                                {product.discount > 0 && (
                                    <span style={styles.originalPrice}>
                                        ${product.price}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;