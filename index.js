//Author: Chloe Gentry 
//Last modified: 11/21/2023
//File name: index.js- express server code modified to support mongo
//Mongo Atlas connection string: 
//    mongodb+srv://chloegentry:libraryDatabase@cluster0.k3xsof1.mongodb.net/LibraryDatabase

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

//Displays all books, or books filtered by availability 
app.get('/books', async (req, res) => {
   try {
      const avail = req.query.avail;

      if (avail !== undefined) 
      {
         filteredBooks = await Book.find({ avail });
      }
      
      const allBooks = await Book.find({});

      if (avail)
         responseBookList = responseBooks(filteredBooks); 
      else 
         responseBookList = responseBooks(allBooks); 

      if (!allBooks)
         res.status(404).json({error:"ERROR 404: No books found."}); 
      else
      res.status(200).json(responseBookList); 
   } catch (error) {
       console.error(error);
       res.status(500).send('Internal Server Error');
   }
});

//helper fxn to display id and title
function responseBooks(listBooks) 
{ 
   const response = (listBooks).map(book => ({
      id: book.IDandTitle.id,
      title: book.IDandTitle.title
   }));

   return response;
}

//Adds a new book to the database
app.post("/books", async (req, res) => { 
   const newBook = req.body;
   try { 
      const bookExists = await Book.exists({id: newBook.id}); 
      if (!bookExists)
      {  
         const newBookData = new Book(newBook);
         const savedBook = await newBookData.save();
         console.log("201 OK");
         res.status(201).json(`{"id":"${newBookData.id}", "title":"${newBookData.title}"`); 
         return;
      }
      else 
      { 
         console.log("ERROR 403: book already exists.");
         res.status(403).json({error:"ERROR 403: book already exists."});
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
}); 

//Gets all book info for a specific book id
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
         res.status(404).json({error:"ERROR 404: Book not found."}); 
         console.log("ERROR 404: Book not found");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
});

//Updates a book's info based on book id
app.put("/books/:id", async (req,res) => { 
   const bookId = req.params.id; 
   const updateBookData = req.body; 

   try { 
      const updateBook = await Book.findOneAndUpdate( 
         { id: bookId },
         { $set: updateBookData },
         { new: true });

      if (updateBook)
      {
         res.status(200).json(updateBook); 
         console.log("200 OK");
         return;
      }
      else
      {
         res.status(404).json({error:"ERROR 404: book not found."}); 
         console.log("ERROR 404: book not found.");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }
}); 

//Deletes a book based on book id
app.delete("/books/:id", async (req,res) => { 
   const bookId = req.params.id; 
   try { 
      const deleteBook = await Book.findOneAndDelete( 
         {id: bookId});

      if (deleteBook)
      { 
         res.status(200).send("200"); 
         console.log("200 OK"); 
         return;
      }
      else 
      { 
         res.status(204).json({error:"ERROR 204: nothing to delete."}); 
         console.log("ERROR 204: nothing to delete.");
         return;
      }
   } catch (error) {
      console.error(error);
      res.status(500).send('Internal Server Error');
   }    
});


app.listen(3000, () => {
   console.log("Server running at http://localhost:3000/books");
});

