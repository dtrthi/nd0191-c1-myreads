import { useCallback, useEffect, useState } from "react";
import "./App.css";
import { getAll, update } from "./BooksAPI";
import Bookshelf from "./components/Bookshelf";
import { Link } from "react-router-dom";

function App() {
  const [showSearchPage, setShowSearchpage] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
  const [wantToReadBooks, setWantToReadBooks] = useState([]);
  const [readBooks, setReadBooks] = useState([]);

  const getAllBooks = async () => {
    const res = await getAll();
    setAllBooks(res);
  };

  useEffect(() => {
    getAllBooks();
  }, []);

  useEffect(() => {
    const currentlyReading = [];
    const wantToRead = [];
    const read = [];
    for (const book of allBooks) {
      if (book.shelf === "currentlyReading") {
        currentlyReading.push(book);
      }
      if (book.shelf === "wantToRead") {
        wantToRead.push(book);
      }
      if (book.shelf === "read") {
        read.push(book);
      }
    }
    setCurrentlyReadingBooks(currentlyReading);
    setWantToReadBooks(wantToRead);
    setReadBooks(read);
  }, [allBooks]);

  const handleShelfChange = useCallback((book, shelf) => {
    update(book, shelf).then((data) => {
      getAllBooks();
    });
  }, []);

  return (
    <div className="app">
        <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <Bookshelf
                name="Currently Reading"
                books={currentlyReadingBooks}
                onShelfChange={handleShelfChange}
              />
              <Bookshelf
                name="Want to Read"
                books={wantToReadBooks}
                onShelfChange={handleShelfChange}
              />
              <Bookshelf
                name="Read"
                books={readBooks}
                onShelfChange={handleShelfChange}
              />
            </div>
          </div>
          <div className="open-search">
            <Link to="/search">Add a book</Link>
          </div>
        </div>
    </div>
  );
}

export default App;
