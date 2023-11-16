var express = require('express');
const mongoose = require('./mongoose'); 
const Book = require('./books');

var app = express();

app.use(express.json());
app.use(function(req, res, next) {   
   res.header('Access-Control-Allow-Origin', '*');   
   res.header('Access-Control-Allow-Methods', 
   'GET,PUT,POST,PATCH,DELETE,OPTIONS');   
   res.header('Access-Control-Allow-Headers',         
   'Content-Type, Authorization, Content-Length, X-Requested-With');   
   if (req.method === "OPTIONS") res.sendStatus(200);   
   else next(); 
});


let books = [
    {id: "1", title: "Reactions in REACT", author: "Ben Dover", publisher: "Random House", isbn: "978-3-16-148410-0", avail: true},
    {id: "2", title: "Express-sions", author: "Freida Livery", publisher: "Chaotic House", isbn: "978-3-16-148410-2", avail: true},
    {id: "3", title: "Restful REST", author: "Al Gorithm", publisher: "ACM", isbn: "978-3-16-143310-1", avail: true},
    {id: "4", title: "See Essess", author: "Anna Log", publisher: "O'Reilly", isbn: "987-6-54-148220-1", avail: false, who: "Homer", due: "1/1/23"},
    {id: "5", title: "Scripting in JS", author: "Dee Gital", publisher: "IEEE", isbn: "987-6-54-321123-1", avail: false, who: "Marge", due: "1/2/23"},
    {id: "6", title: "Be An HTML Hero", author: "Jen Neric", publisher: "Coders-R-Us", isbn: "987-6-54-321123-2", avail: false, who: "Lisa", due: "1/3/23"}
];

//Map of books by id and title
const booksMap = new Map();
books.forEach(book => {
    booksMap.set(book.id, { id: book.id, title: book.title });
});

app.get("/books", (req, res) => {
   const avail = req.query.avail === "true";

   if (req.query.avail!==undefined)
      filterBooksByAvail(avail, res);   

   else
   {
      booksInfo = showIDandTitle(books); 
      if (booksInfo.length > 0)
      {
         res.status(200).json(booksInfo); 
         console.log("200 OK");
         return;
      }
      else 
      { 
         res.status(404).json({error:"no books found"}); 
         console.log("ERROR 404: no books found.");
         return;
      }
   }
}); 

//Helper functions
function filterBooksByAvail(avail, res) 
{ 
   if (avail)
      filterBooks = books.filter((book) => book.avail === true); 
   else 
      filterBooks = books.filter((book) => book.avail === false); 

   const filteredBooksData = showIDandTitle(filterBooks);
   res.status(200).json(filteredBooksData); 
   return; 
}

function showIDandTitle(availQuery) 
{ 
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
      booksMap.set(newBook.id, { id: newBook.id, title: newBook.title });
      console.log("201 OK");
      res.status(201).send("201"); 
      return;
   }
   else 
   { 
      console.log("ERROR 403: book already exists.");
      res.status(403).json({error:"book already exists"});
      return;
   }
}); 

app.get("/books/:id", (req, res) => { 
   const bookId = req.params.id; 
   const book = books.find((book) => book.id === bookId); 

   if (book)
   {
      res.status(200).json(book); 
      console.log("200 OK"); 
      return;
   }
   else 
   {
      res.status(404).json({error:"not found"}); 
      console.log("ERROR 404: book not found");
      return;
   }
});

app.put("/books/:id", (req,res) => { 
   const bookId = req.params.id; 
   const bookIndex = books.findIndex((book) => book.id === bookId); 
   if (bookIndex != -1) 
   { 
      const updateBook = req.body; 
      const existingBook = books[bookIndex]; 
      const updateBookKeys = Object.keys(updateBook);

      updateBookKeys.forEach((prop) => {
         existingBook[prop] = updateBook[prop];
      });

      res.status(200).send("200"); 
      console.log("200 OK");
      return;
   }
   else 
   { 
      res.status(404).json({error:"not found"}); 
      console.log("ERROR 404: book not found.");
      return;
   }

}); 

app.delete("/books/:id", (req,res) => { 
   const bookId = req.params.id; 
   const bookIndex = books.findIndex((book) => book.id === bookId); 
   if (bookIndex != -1) 
   {
      books.splice(bookIndex, 1); 
      res.status(200).send("200"); 
      console.log("200 OK"); 
      return;
   }
   else 
   { 
      res.status(204).json({error:"not found"}); 
      console.log("ERROR 204: nothing to delete.");
      return;
   }
});


app.listen(3000, () => {
   console.log("Server running at http://localhost:3000");
});

