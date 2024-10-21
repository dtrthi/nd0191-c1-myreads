import "./App.css";
import { useCallback, useEffect, useMemo, useState } from "react";
import { getAll, search, update } from "./BooksAPI";
import { Link, useSearchParams } from "react-router-dom";
import Book from "./components/Book";

function Search() {
  const [allBooks, setAllBooks] = useState([]);
  const bookMap = useMemo(() => {
    if (!Array.isArray(allBooks)) {
      return {};
    }
    const map = {};
    for (const book of allBooks) {
      map[book.id] = book;
    }
    return map;
  }, [allBooks]);
  const [searchBooks, setSearchBooks] = useState([]);
  const [myBooks, setMyBooks] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const inputValue = searchParams.get("s");

  const getAllBooks = async () => {
    const res = await getAll();
    setAllBooks(res);
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  useEffect(() => {
    if (searchParams.get("s")) {
      search(searchParams.get("s"), 10).then((res) => {
        if (Array.isArray(res)) {
          setSearchBooks(res);
        } else {
          setSearchBooks([]);
        }
      });
    }
  }, [searchParams.get("s")]);

  useEffect(() => {
    if (Array.isArray(searchBooks)) {
      const books = [];
      for (const idx in searchBooks) {
        const book = searchBooks[idx];
        books.push({ ...book, shelf: bookMap[book.id]?.shelf ?? "none" });
      }
      setMyBooks(books);
    }
  }, [bookMap, searchBooks]);

  const handleShelfChange = useCallback((book, shelf) => {
    update(book, shelf).then(() => getAllBooks());
  }, []);

  const handleKeyDown = (e) => {
    if (e.code === "Enter") {
      setSearchParams({ s: e.target.value });
    }
  };

  return (
    <div className="app">
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title, author, or ISBN"
              defaultValue={inputValue}
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {myBooks.map((book) => (
              <Book key={book.id} book={book} onShelfChange={handleShelfChange} />
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Search;
