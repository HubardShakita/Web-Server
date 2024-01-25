const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
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
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
  const title = 'Главная';
  res.render(createPath('index'), { title });
});

app.get('/contacts', (req, res) => {
  const title = 'Контакты';
  Contact
    .find()
    .then((contacts) => res.render(createPath('contacts'), { contacts, title }))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.get('/posts/:id', (req, res) => {
  const title = 'Матчи';
  Post
    .findById(req.params.id)
    .then((post) => res.render(createPath('post'), { post, title }))
    .catch((error) => {
        console.log(error);
        res.render(createPath('error'), {title: 'Error'})
    })
});

app.delete('/posts/:id', (req, res) => {
  Post
    .findByIdAndDelete(req.params.id)
    .then((result) => {
      res.sendStatus(200);
    })
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/edit/:id', (req, res) => {
  const title = 'Редактирование Матча';
  Post
    .findById(req.params.id)
    .then(post => res.render(createPath('edit-post'), { post, title }))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.put('/edit/:id', (req, res) => {
  const { first_team, second_team, match, text } = req.body;
  const { id } = req.params;
  Post
    .findByIdAndUpdate(req.params.id, { first_team, second_team, text, match })
    .then((result) => res.redirect(`/posts/${id}`))
    .catch((error) => {
      console.log(error);
      res.render(createPath('error'), { title: 'Error' });
    });
});

app.get('/posts', (req, res) => {
  const title = 'Матчи';
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
  const title = 'Добавить Матч';
  res.render(createPath('add-post'), { title });
});

app.use((req, res) => {
  const title = 'Ошибка';
  res
    .status(404)
    .render(createPath('error'), { title });
});