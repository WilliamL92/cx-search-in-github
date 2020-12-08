import React from 'react'
import logo from './logo.svg';
import './App.css';
import { Link } from "react-router-dom"

const path = window.location.pathname.split('/')
const username = path[path.length - 1]
class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {user: ""}
  }

  pushUser(){
    fetch(`http://localhost:9000/push/${username}`)
  }

  getUser() {
    fetch(`https://api.github.com/users/${username}`).then(response => {
      response.json().then(data => {
        this.setState({user: data })
      })
    })
  }

  userNotFound(){
    if (this.state.user.message == "Not Found") {
      return <div>
                <h1>{username} n'est pas un utilisateur Github</h1>
              </div>;
    }
    else {
    this.pushUser()
    let userTab = []
    for(let key in this.state.user){
      userTab.push(`${key}: ${this.state.user[key]}`)
    }
    return <div>
                <h1>Bonjour {this.state.user.login}</h1>
                <h2>Vos informations: </h2>
                {userTab.map(function(a) { 
                  return (
                  <p>{a}</p> 
                  ); 
                })} 
              </div>;
    }
  }

  insertUser(){

  }

  componentDidMount() {
    this.getUser()
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>
            Welcome to my Github
          </p>
          { this.userNotFound()}
        </header>
      </div>
    );
  }
}

export default App;
