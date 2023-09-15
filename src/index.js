import express from 'express'
import cors from 'cors'
import rootRoute from './routes/rootRoute.js'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser('duc'))
app.use(cors({
    origin: "*"
}))

app.use(express.json())
app.use(express.static("."))

app.use('/api',rootRoute)

app.listen(8000)