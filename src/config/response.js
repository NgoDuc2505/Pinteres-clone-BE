//fulfilled 200
const success = (res, content, msg = "success") => {
    res.status(200).json({
        statusCode: 200,
        content,
        msg,
        date: new Date()
    })
}
//rejected 400,404
const failure = (res, statusCode, msg) => {
    res.status(statusCode).json({
        statusCode,
        content: [],
        msg,
        date: new Date()
    })
}
//server error 500
const serverError = (res) => {
    res.status(500).json({
        statusCode: 500,
        content: [],
        msg: "BE ERROR",
        date: new Date()
    })
}

export { serverError, success, failure }