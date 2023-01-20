import express from "express";
import { createNews, deleteNews, getListNews, getSingleNews, updateNews } from "../controllers/news.js";

const router = express.Router();
router.post('/news', createNews)
router.get('/news', getListNews)
router.get('/news/:newsId', getSingleNews)
router.put('/news/:newsId', updateNews)
router.delete('/news/:newsId', deleteNews)

export default router