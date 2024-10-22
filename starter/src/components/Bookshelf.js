import React from "react";
import Book from "./Book";

const Bookshelf = ({ name, books, onShelfChange }) => {
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{name}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} onShelfChange={onShelfChange} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default Bookshelf;
