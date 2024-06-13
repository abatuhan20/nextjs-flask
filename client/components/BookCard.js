import React from 'react';

const BookCard = ({ title, author, publisher, description, similarityScore, siteUrl, imageUrl }) => {
  const truncatedDescription = description && description.length > 150 ? description.substring(0, 150) + '...' : description;
    
  return (
    <div className="book-card">
      <img src={imageUrl} alt={title} className="book-image" />
      <div className="book-details">
        <h2>{title}</h2>
        <p><strong>Yazar:</strong> {author}</p>
        <p><strong>Yayıncı:</strong> {publisher}</p>
        <p><strong>Açıklama:</strong> {truncatedDescription}</p>
        <p><strong>Benzerlik Skoru:</strong> {similarityScore}</p>
        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="btn">Siteye Git</a>
      </div>
    </div>
  );
};

export default BookCard;