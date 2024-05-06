import React from 'react';

const BookCard = ({ title, author, publisher, description, similarityScore, siteUrl, imageUrl }) => {
  const truncatedDescription = description && description.length > 150 ? description.substring(0, 150) + '...' : description;
    
  return (
    <div className="book-card">
      <img src={imageUrl} alt={title} className="book-image" />
      <div className="book-details">
        <h2>{title}</h2>
        <p><strong>Author:</strong> {author}</p>
        <p><strong>Publisher:</strong> {publisher}</p>
        <p><strong>Description:</strong> {truncatedDescription}</p>
        <p><strong>Similarity Score:</strong> {similarityScore}</p>
        <a href={siteUrl} target="_blank" rel="noopener noreferrer" className="btn">Siteye Git</a>
      </div>
    </div>
  );
};

export default BookCard;