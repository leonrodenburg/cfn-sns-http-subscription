require('isomorphic-fetch')
const express = require('express')
const bodyParser = require('body-parser')
const util = require('./util')

const app = express()
app.use(util.overrideContentType())
app.use(bodyParser.json())

let postCalls = 0
let postBody = {}

const handleSubscription = body => {
  if (!body.SubscribeURL) throw 'No subscribe URL found in JSON body'
  return fetch(body.SubscribeURL)
}

app.get('/', async (req, res) => {
  return res.status(200).json({
    posts: postCalls,
    lastPostBody: postBody,
  })
})

app.post('/', async (req, res) => {
  console.log('Got POST call:')
  console.log(req.body)

  postCalls++
  postBody = req.body

  if (req.body.Type === 'SubscriptionConfirmation') {
    const response = await handleSubscription(req.body)
    return res.status(response.status).end()
  } else if (req.body.Type === 'Notification') {
    postBody = req.body
    return res.status(200).end()
  } else {
    return res.status(400).end()
  }
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Application listening on port ${port}`))
