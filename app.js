const express = require('express');
const books = require('./books');
const uuid = require('uuid');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('index', {
        title: "Book App",
        books
    });
});

app.use((req, res, next) => {
    console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    next();
})

/**Get all members */

app.get('/api/books', (req, res) => {
    res.json(books);
});

/**Get a single member */

app.get('/api/books/:id', (req, res) => {
    const exist = books.some(m => m.id === parseInt(req.params.id));
    if (exist) {
        res.json(books.filter(m => m.id === parseInt(req.params.id)));
    } else {
        res.status(400).json({ msg: `No book with the id:${req.params.id} exists` });
    }
});

/**Add a member */

app.post('/api/books', (req, res) => {
    const newBook = {
        id: uuid.v4(),
        name: req.body.name,
        author: req.body.author
    }

    if (!newBook.name || !newBook.author) {
        return res.status(400).json({ msg: "Do not leave empty inputs" })
    }

    books.push(newBook);
    res.redirect('/');
});

/**Update a member */

app.put('/api/books/:id', (req, res) => {
    const exist = books.some(m => m.id === parseInt(req.params.id));
    if (exist) {
        const updateBook = req.body;
        books.forEach(m => {
            if (m.id === parseInt(req.params.id)) {
                m.name = updateBook.name ? updateBook.name : m.name;
                m.author = updateBook.author ? updateBook.author : m.author;
                res.json({ msg: "Book updated", m });
            }
        })
    } else {
        res.status(400).json({ msg: `No book with the id:${req.params.id} exists` });
    }
});

/**Delete a member */

app.delete('/api/books/:id', (req, res) => {
    const exist = books.some(m => m.id === parseInt(req.params.id));
    if (exist) {
        res.json({ msg: "book is deleted", books: books.filter(m => m.id !== parseInt(req.params.id)) });
    } else {
        res.status(400).json({ msg: `No book with the id:${req.params.id} exists` });
    }
});

