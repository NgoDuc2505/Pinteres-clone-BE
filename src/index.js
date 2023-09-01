import express from 'express'
import cors from 'cors'
import rootRoute from './routes/rootRoute.js'

const app = express()

app.use(cors({
    origin: "*"
}))

app.use(express.json())
app.use(express.static("."))

app.use('/api',rootRoute)

app.listen(8000)