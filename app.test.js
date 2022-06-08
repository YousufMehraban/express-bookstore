const superTest = require('supertest')
const app = require('./app')
const db = require('./db')
const Book = require('./models/book')


let testBooks;
let testBook;
beforeEach(async ()=>{
    const book = await Book.create({
        "isbn": "0691161518",
        "amazon_url": "http://a.co/eobPtX2",
        "author": "Matthew Lane",
        "language": "english",
        "pages": 264,
        "publisher": "Princeton University Press",
        "title": "Power-Up: Unlocking the Hidden Mathematics in Video Games",
        "year": 2017
      })
    testBook = {book}
    const books = await Book.findAll()
    testBooks = {books}
    // return {books}
})

afterEach(async()=>{
    await db.query(`DELETE FROM books`)
})

afterAll(async ()=>{
    await db.end()
})

describe('testing getting all books', ()=>{
    test('/get all books', async ()=>{
        const result = await superTest(app).get('/books')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(testBooks)
    })
    test('/get testing 404', async()=>{
        const result = await superTest(app).get('/wrong')
        expect(result.statusCode).toBe(404)
    })
})

describe('testing getting one book', ()=>{
    test('/get a book', async ()=>{
        const result = await superTest(app).get('/books/0691161518')
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual(testBook)
    })
    test('/get testing 404', async()=>{
        const result = await superTest(app).get('/wrong/0')
        expect(result.statusCode).toBe(404)
    })
})

const newBook = {
    "isbn": "0987654321",
    "amazon_url": "http://a.co/eobPtX2",
    "author": "Gayle Laakmann",
    "language": "english",
    "pages": 488,
    "publisher": "CareerCup LLC",
    "title": "Cracking the Coding Interview",
    "year": 2017
  }

describe('testing creating a book', ()=>{
    test('/post a book', async ()=>{
        const result = await superTest(app).post('/books').send(newBook)
        expect(result.statusCode).toBe(201)
        expect(result.body).toEqual({book: newBook})
    })
    test('/post testing 404', async()=>{
        const result = await superTest(app).post('/wrong').send(newBook)
        expect(result.statusCode).toBe(404)
    })
})


describe('testing updating a book', ()=>{
    test('/put a book', async ()=>{
        const result = await superTest(app).put('/books/0691161518').send(newBook)
        expect(result.statusCode).toBe(200)
        expect(result.body).toEqual({book: {
            "isbn": "0691161518",
            "amazon_url": "http://a.co/eobPtX2",
            "author": "Gayle Laakmann",
            "language": "english",
            "pages": 488,
            "publisher": "CareerCup LLC",
            "title": "Cracking the Coding Interview",
            "year": 2017
        }})
    })
    test('/put testing 404', async()=>{
        const result = await superTest(app).put('/wrong/0').send(newBook)
        expect(result.statusCode).toBe(404)
    })
})