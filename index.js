const express = require('express')
const app = express()
const port = process.env.PORT || 3000

let callCount = 1

app.get('/', (req, res) => {
  return res.status(200).json({
    calls: callCount++
  })
})

app.listen(port, () => console.log(`Application listening on port ${port}`))
