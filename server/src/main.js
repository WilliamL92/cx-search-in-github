const express = require('express')
const cors = require('cors')
// const initDatabase = require('./database')
const fetch = require('node-fetch');

const knex = require('knex')({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'root',
    database : 'searchGithub',
    port: '5000'
  },
  useNullAsDefault: true
});

function run(port) {
  const app = express()
  // const db = initDatabase()

  // cross origin request 
  app.use(cors())
  app.get('/push/favicon.ico', function(req, res) { 
    res.sendStatus(204); 
});
  app.get('/push/:username', (req, res, next) => {
      let user = ""
      knex.select('login').from('users').then((req, res)=>{
      user = req
    })

  fetch(`https://api.github.com/users/${req.params.username}`, {method: 'GET'})
  .then((res) => {
     return res.json()
  })
  .then((data)=>{
    let userInBase = false
    for(let key in user){
      console.log(user[key].login)
      if(user[key].login == data.login){
        userInBase = true
      }
    }
    if(!userInBase){
    knex('users').insert({
      login: data.login,
      user_id: data.user_id,
      node_id: data.node_id,
      avatar_url: data.avatar_url,
      gravatar_id: data.gravatar_id,
      url: data.url,
      html_url: data.html_url,
      followers_url: data.followers_url,
      following_url: data.following_url,
      gists_url: data.gists_url,
      starred_url: data.starred_url,
      subscriptions_url: data.subscriptions_url,
      organizations_url: data.organizations_url,
      repos_url: data.repos_url,
      events_url: data.events_url,
      received_events_url: data.received_events_url,
      type: data.type,
      site_admin: data.site_admin,
      name: data.name,
      company: data.company,
      blog: data.blog,
      location: data.location,
      email: data.email,
      hireable: data.hireable,
      bio: data.bio,
      twitter_username: data.twitter_username,
      public_repos: data.public_repos,
      public_gists: data.public_gists,
      followers: data.followers,
      following: data.following,
      created_at: data.created_at,
      updated_at: data.updated_at
    }).then((req)=>{
      userInBase = false
      return req
    })
  }
    res.send(JSON.stringify(data))
  })
  })
  
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}

const args = process.argv.slice(2)
if (args.length !== 1) {
  console.log("Usage: node src/main.js <port>")
  process.exit(0)
}

const port = args[0]
run(parseInt(port, 10))
