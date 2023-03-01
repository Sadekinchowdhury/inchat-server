const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors')



app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER}:${process.env.USER_PASS}@clusterfit.lgaupy2.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function run() {
    try {
        const UserCollection = client.db('inchats').collection('user')
        const PostsCollection = client.db('inchats').collection('posts')
        const commentCollection = client.db('inchats').collection('comment')


        // post kora
        app.post('/post', async (req, res) => {
            const post = req.body;

            const result = await PostsCollection.insertOne(post)
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const post = req.body;
            const result = await UserCollection.insertOne(post)
            res.send(result)
        })

        // user by email
        app.get("/users/:email", async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await UserCollection.findOne(query);
            res.send(result);
        });

        // get all of the post
        app.get('/allpost', async (req, res) => {
            const query = {}
            const result = await PostsCollection.find(query).sort({ date: -1 }).limit(100).toArray();
            res.send(result)
        })

        // postlike rumel

        // postlike rumel
        app.put("/post/:id", async (req, res) => {
            const post = req.body;
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    liking: post?.like,
                    likeusersname: post?.username,
                },
            };
            const result = await PostsCollection.updateMany(
                filter,
                updateDoc,
                options
            );
            res.send(result);
        });

        // comment rumel
        app.post("/post/comment/:id", async (req, res) => {
            const post = req.body;

            const result = await commentCollection.insertOne(post);
            res.send(result);
        });
        // comment every post by all users rumel
        app.get("/post/comment/:id", async (req, res) => {
            const id = req.params.id;
            const query = {
                commentId: id,
            };
            const result = await commentCollection.find(query).toArray();
            res.send(result);

        });

        // delete 
        app.delete("/post/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await PostsCollection.deleteOne(query);
            // console.log(result)
            res.send(result);
        });
        app.put("/post/edit/:id", async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const posts = req.body;
            const option = { upsert: true };
            const updatedUser = {
                $set: {
                    post: posts.post,
                    image: posts.image,

                },
            };
            const result = await PostsCollection.updateMany(
                filter,
                updatedUser,
                option
            );
            res.send(result);
        });

        // app.post('/comment', async (req, res) => {
        //     const post = req.body;
        //     const result = await commentCollection.insertOne(post)
        //     res.send(result)
        // })


        // app.get('/comment/:id', async (req, res) => {
        //     const comment_id = req.params.id;
        //     const query = { _id: ObjectId(comment_id) }
        //     const result = await commentCollection.findOne

        //         (query)
        //     res.send(result)


        // })

        // app.put('/post/comment/:id', async (req, res) => {
        //     const post = req.body;
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        //     const options = { upsert: true };
        //     const updateDoc = {
        //         $set: {
        //             comments: post.comment,
        //             commentusername: post.username

        //         }
        //     }
        //     const result = await PostsCollection.updateMany(filter, updateDoc, options)
        //     res.send(result)
        // })






    }
    finally {

    }
}
run()




app.get('/', (req, res) => {
    res.send('Welcome Inchat')
})
app.listen(port, () => {
    console.log(`this server is running on ${port}`)
})