const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Post = require('./models/post');
const Contact = require('./models/contacts');
const db = 'mongodb+srv://Vlados:caRe34BooK.3443@atlascluster.hi7ocrs.mongodb.net/node-blog?retryWrites=true&w=majority';
const app = express();

app.set('view engine', 'ejs');

const PORT = 3000;

mongoose
    .connect(db)
    .then((res) => console.log('Connected to DB'))
    .catch((error) => console.log(error))

const createPath = (page) => path.resolve(__dirname, 'EjsFiles', `${page}.ejs`);

app.listen(PORT, (error) => {
  error ? console.log(error) : console.log(`listening port ${PORT}`);//запускаем сервер с коллбэком
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));//включаем отображение времени отклика и тип запроса в терминале
app.use(express.urlencoded({ extended: false }));
app.use(express.static('styles')); //делаем css файл динамическим

app.get('/', (req, res) => {
  const title = 'Home';
  res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
  const title = 'Contacts';
  Contact
    .find()
    .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.get('/posts/:id', (req, res) => {
  const title = 'Post';
  Post
    .findById(req.params.id)
    .then((post) => res.render(createPath('post'), { post, title }))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.get('/posts', (req, res) => {
  const title = 'Posts';
  Post
    .find()
    .sort({createdAt: -1})
    .then((posts) => res.render(createPath('posts'), { posts, title }))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.post('/add-post', (req, res) => {
  const { first_team, second_team, text, match } = req.body;
  const post = new Post({first_team, second_team, text, match});
  post
    .save()
    .then((result) => res.redirect('/posts'))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.get('/add-post', (req, res) => {
  const title = 'Add Post';
  res.render(createPath('add-post'), { title });
});

app.use((req, res) => {
  const title = 'Error Page';
  res
    .status(404)
    .render(createPath('error'), { title });
});