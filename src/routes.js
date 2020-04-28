const routes = require('express').Router();
const multer = require('multer');
const multerConfig = require('./config/multer');

//Para pegar todos os posts
const Post = require('./models/Post');

routes.get('/posts', async (req, res) => {
    const posts = await Post.find();

    return res.json(posts);
})

//rota para upload de imagens 
routes.post("/posts", multer(multerConfig).single("file"), async (req, res) => {
    /*
    Nessa constante abaix, para que no post não fique repetitivo o req. file, fazemos uma desetruturação
    Antes disso, o post estava da seguinte maneira:
        name: req.file.originalname,
        size: req.file.size,
        etc.
    */
    const {originalname: name, size, key, location: url = ''} = req.file;

    const post = await Post.create({
        name, 
        size,
        key,
        url
    });
    return res.json(post);
});

routes.delete('/posts/:id', async (req, res) => {
    const post = await Post.findById(req.params.id);

    await post.remove();

    return res.send();
});
module.exports = routes;