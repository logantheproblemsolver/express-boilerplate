const express = require('express')
const uuid = require('uuid/v4')
const {isWebUri} = require('valid-url')
const logger = require('../logger')
const {bookmarks} = ('../data')


const bookmarkRouter = express.Router();
const bodyParser = express.json();


bookmarkRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(data.bookmarks)
    })
    .post(bodyParser, (req, res) => {
        for (const field of ['title', 'url', 'rating']) {
            if (!req.body[field]) {
                logger.error(`${field} is required`)
                return res 
                    .status(400)
                    .send(`'${field}' is required`)
            }
        }

        const {title, url, description, rating} = req.body

        if(!Number.isInteger(rating) || rating < 0 || rating > 5) {
            logger.error(`Invalid rating '${rating}' supplied`)
            return res
                .status(400)
                .send(`'rating' must be a number between 0 and 5`)
        }

        if (!isWebUri(url)) {
            logger.error(`Invalid url '${url} supplied`)
            return res 
                .status(400)
                .send(`'url' must be a valid URL`)
        }

        const bookmark = {id: uuid(), title, url, description, rating}

        data.bookmarks.push(bookmark)

        logger.info(`Bookmark with id ${bookmark.id} created`)
        res 
            .status(201)
            .location(`http://localhost:8000/booksmarks/${bookmark.id}`)
            .json(bookmark)

    })


bookmarkRouter  
    .route('/bookmarks/:bookmark_id')
    .get((req, res) => {
        const {bookmark_id} = req.params

        const bookmark = data.bookmarks.find(c => c.id == bookmark_id)

        if(!bookmark) {
            logger.error(`Bookmark with id ${bookmark_id} not found.`)
            return res 
                .status(404)
                .send('Bookmark Not Found')
        }
        res.json(bookmark)
    })
    .delete((req, res) => {
        const {bookmark_id} = req.params
        
        const bookmarkIndex = data.bookmarks.findIndex(b => b.id === bookmark_id)


        if (bookmarkIndex === -1) {
            logger.error(`Bookmark with id ${bookmark_id} not found`)
            return res
                .status(404)
                .send('Bookmark Not Foud')
        }

        data.bookmarks.splice(bookmarkIndex, 1)

        logger.info(`Bookmark with id ${bookmark_id} delted.`)
        res
            .status(204)
            .end()

    })


module.exports = bookmarkRouter