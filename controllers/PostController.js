import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map((obj) => obj.tags)
            .flat()
            .slice(0, 5)
        res.json(tags)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить tags",
        })
    }
}

export const getLastComments = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();

        const comments = posts.map((obj) => obj.comments)
            .flat()
            .slice(0, 5)
        res.json(comments)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить comments",
        })
    }
    
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('user').exec();
        res.json(posts)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const sortByTag = async (req, res) => {
    try {
        const tagName = (req.params.name)
        const postsList = await PostModel.find({tags: tagName}).exec();
        res.json(postsList)
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи для тега",
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = (req.params.id).trim();
        await PostModel.findOneAndUpdate({_id: postId},
            {$inc: {viewsCount: 1}},
            {returnDocument: "after"} ).populate(`user`)
            .then((doc, err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Не удалось вернуть статью",
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    })
                }
                res.json(doc)
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                })
            });
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const createComment = async (req, res) => {
    try {
        const postId = (req.params.id).trim();
        await PostModel.updateOne({_id: postId}, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            comments: req.body.comments,
        })
        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось создать комментарий",
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

        await PostModel.findOneAndDelete({_id: postId})
            .then((doc, err) => {
                if (err) {
                    return res.status(500).json({
                        message: "Не удалось удалить статью",
                    })
                }

                if (!doc) {
                    return res.status(404).json({
                        message: "Статья не найдена"
                    })
                }
                res.json({
                    success: true
                })
            })
            .catch((err) => {
                console.log(err)
                return res.status(500).json({
                    message: "Не удалось вернуть статью",
                })
            });
    } catch (err) {

        console.log(err)
        res.status(500).json({
            message: "Не удалось получить статьи",
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
            comments: req.body.comments
        })
        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось зарегистрироваться",
        })
    }
}

export const sortByNewest = async (req, res) => {
    try {
        const posts = await PostModel.sort({createdAt: -1});
        res.json(posts)
    } catch (err) {

    }
}

export const update = async (req, res) => {
    try {
        const postId = (req.params.id).trim();

        await PostModel.updateOne({_id: postId}, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
            comments: req.body.comments
        })
        res.json({
            success: true,
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Не удалось обновить статью.",
        })
    }
}
