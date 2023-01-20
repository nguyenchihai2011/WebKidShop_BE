import mongoose from "mongoose";
import News from "../models/news.js";


export const createNews = (req, res) => {
    const news = new News({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        desc: req.body.desc,
    })
    return news
        .save()
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).json({ err })
        })
}

export const getListNews = (req, res) => {
    News.find()
        .select("_id title desc")
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).json({ err })
        })
}

export const getSingleNews = (req, res) => {
    const id = req.params.newsId;
    News.findById(id)
        .then(data => {
            res.status(200).json({ data })
        })
        .catch(err => {
            res.status(500).json({ err })
        })
}

export const updateNews = (req, res) => {
    const id = req.params.newsId;
    const updateObject = req.body
    News.findByIdAndUpdate({ _id: id }, { $set: updateObject })
        .exec()
        .then(() => {
            res.status(200).json({ 
                success: true,
                data: updateObject,
            })
        })
        .catch(err => {
            res.status(500).json({ 
                success: false,
                error: err, 
            })
        })
}

export const deleteNews = (req, res) => {
    const id = req.params.newsId;
    News.findByIdAndRemove(id)
        .exec()
        .then(() => {
            res.status(200).json({ success: true })
        })
        .catch(() => {
            res.status(500).json({ success: false })
        })
}



