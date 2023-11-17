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


app.get('/books', async (req, res) => {
   try {
      const avail = req.query.avail;
      if (avail!==undefined) 
      {
         filteredBooks = await Book.find({ avail });
      }
      
      const allBooks = await Book.find({});

      if (avail)
         responseBookList = responseBooks(filteredBooks); 
      else 
         responseBookList = responseBooks(allBooks); 

      if (!allBooks)
         res.status(404).send("Error 404: no books found"); 
      else
      res.status(200).json(responseBookList); 
   } catch (error) {
       console.error(error);
       res.status(500).send('Internal Server Error');
   }
});

//helper fxn
function responseBooks(listBooks) 
{ 
   const response = (listBooks).map(book => ({
      id: book.IDandTitle.id,
      title: book.IDandTitle.title
   }));

   return response;
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

app.get("/books/:id", async (req, res) => { 
   try {
      const bookId = req.params.id; 
      const book = await Book.findOne({ id: bookId }).select('-_id');

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
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
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

