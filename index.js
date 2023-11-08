var express = require('express');
var app = express();
app.use(express.json());


var books = [
    {id: "1", title: "Reactions in REACT", author: "Ben Dover", publisher: "Random House", isbn: "978-3-16-148410-0", avail: "true"},
    {id: "2", title: "Express-sions", author: "Freida Livery", publisher: "Chaotic House", isbn: "978-3-16-148410-2", avail: "true"},
    {id: "3", title: "Restful REST", author: "Al Gorithm", publisher: "ACM", isbn: "978-3-16-143310-1", avail: "true"},
    {id: "4", title: "See Essess", author: "Anna Log", publisher: "O'Reilly", isbn: "987-6-54-148220-1", avail: "false", who: "Homer", due: "1/1/23"},
    {id: "5", title: "Scripting in JS", author: "Dee Gital", publisher: "IEEE", isbn: "987-6-54-321123-1", avail: "false", who: "Marge", due: "1/2/23"},
    {id: "6", title: "Be An HTML Hero", author: "Jen Neric", publisher: "Coders-R-Us", isbn: "987-6-54-321123-2", avail: "false", who: "Lisa", due: "1/3/23"}
 ];

const booksMap = new Map();
books.forEach(book => {
    booksMap.set(book.id, { id: book.id, title: book.title });
});

app.get("/books", (req, res) => {
   const { avail } = req.query;

   if (avail === "true")
   { 
      const availBooks = books.filter((book) => book.avail === "true");
      const filteredAvailBooksData = showIDandTitle(availBooks); 
      res.json(filteredAvailBooksData); 
   } 
   else if (avail === "false")
   {
      const unavailBooks = books.filter((book) => book.avail === "false"); 
      const filteredUnavailBooksData = showIDandTitle(unavailBooks);  
      res.json(filteredUnavailBooksData); 
   }
   else
   {
      booksInfo = showIDandTitle(books); 
      if (booksInfo)
      {
         res.json(booksInfo);
         res.status(200); 
         console.log("200 OK")
      }
      else 
      { 
         res.status(404); 
         console.log("ERROR 404: no books found.")
      }
   }
});

function showIDandTitle(availQuery) { 
   return availQuery.map(book => {
      const { id, title } = booksMap.get(book.id);
      return { id, title };
   }); 
}

app.post("/books", (req, res) => { 
   const newBook = req.body;
   const bookExists = books.find((book) => book.id === newBook.id); 
   if (!bookExists)
   {  
      books.push(newBook); 
      booksMap.set(newBook.id, newBook.title);
      //res.setHeader('Content-Type', 'text/plain');
      res.status(201); 
      console.log("201 OK");
   }
   else 
   {
      res.status(403); 
      console.log("ERROR 403: book already exists.")
   }
}); 

app.get("/books/:id", (req, res) => { 
   const bookId = req.params.id; 
   const book = books.find((book) => book.id === bookId); 

   if (book)
   {
      res.json(book);
      res.status(200); 
      console.log("200 OK")
   }
   else 
   {
      res.status(404); 
      console.log("ERROR 404: book not found")
   }
});



app.use(function(req, res, next) {   
   res.header('Access-Control-Allow-Origin', '*');   
   res.header('Access-Control-Allow-Methods', 
   'GET,PUT,POST,PATCH,DELETE,OPTIONS');   
   res.header('Access-Control-Allow-Headers',         
   'Content-Type, Authorization, Content-Length, X-Requested-With');   
   if (req.method === "OPTIONS") res.sendStatus(200);   
   else next(); 
});

app.listen(3000, () => {
   console.log("Server running at http://localhost:3000");
});

