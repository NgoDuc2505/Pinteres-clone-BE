import express from 'express'
import { postCommentHandler, getPostCommentHandler, updateContentHandler, deleteCommentHandler } from '../../controllers/commentController/commentController.js'
import { authentication, checkUserDidLogin } from '../../services/jwt/JWTservices.js'

const commentRoute = express.Router()
commentRoute.all('*',checkUserDidLogin,authentication)

commentRoute.post('/postComment/:postId', postCommentHandler)
commentRoute.get('/getPostComment/:postId', getPostCommentHandler)
commentRoute.put('/updateContent/:commentId', updateContentHandler)
commentRoute.delete('/deleteComment/:commentId', deleteCommentHandler)
export default commentRoute