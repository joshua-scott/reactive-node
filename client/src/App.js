import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'

class App extends Component {
  state = {
    currentTime: ''
  }

  updateTime = () => {
    fetch('/api/time')
      .then(res => res.json())
      .then(data => {
        console.log(data.time)
        this.setState({ currentTime: data.time })
      })
  }

  render() {
    const { currentTime } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {!currentTime
            ? `Click the button!`
            : `The last time you clicked was ${currentTime}`}
        </p>
        <button onClick={this.updateTime}>Click</button>
      </div>
    )
  }
}

export default App
