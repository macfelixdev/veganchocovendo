/******************************************************************************
* Application: Vegan Chocolate Vending Machine
* Developer:   Edgar Francis Felix
* Date:        4/17/2019
* Description: -This application is the system behind the Vegan Chocolate
*               Vending Machine.
*              -Accepts coins of the following denominations:
*                  10c, 20c, 50c, $1, $2.
*              -Dispenses the following menu items:
*                  Organic Raw ($2.00)
*                  Caramel ($2.50)
*                  Hazelnut ($3.10)
*              -Dispenses unused change at the end of the transaction.
*              -Has an "cancel" command that exits the transaction.
*******************************************************************************/

"use strict";

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import './index.css'

//Main component
class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      totalCoin : 0,
      userAction : null,
      actionMessages : {
        msgWelcome : "Welcome! Insert coins to start.",
        msgDispenseItem : null,
        msgInvalid5c : null,
        msgInvalidCoin : null,
        msgDispenseCoin : null,
        msgValidCoins : null,
        msgExit : null,
      },
      welcomeTimerID : null
    };
    // this.addTotalCoin = this.addTotalCoin.bind(this);
    this.evaluateCoin = this.evaluateCoin.bind(this);
    this.performUserAction = this.performUserAction.bind(this);
  }

  //****************************************************************************
  // BUSINESS LOGIC
  //****************************************************************************

  // Method that performs the selected user action.
  performUserAction(userAction,insertedCoin){
    let totalCoin = this.state.totalCoin;
    let coinChange = 0;
    let newMessages = null;
    let welcomeTimerID = null;
    this.setState({userAction:userAction,totalCoin:0});

    switch (userAction) {
      // calculate change amount for each snack
      case "Organic Raw":
        coinChange = this.state.totalCoin - 2;
        break;
      case "Caramel":
        coinChange = this.state.totalCoin - 2.5;
        break;
      case "Hazelnut":
        coinChange = this.state.totalCoin - 3.1;
        break;
      // Add valid coin to total coin. If invalid, just set the userAction to the invalid coin.
      case "coin":
        userAction = this.evaluateCoin(insertedCoin);
        break;
      default:
    }

    // Stop any scheduled "welcome" message
    clearInterval(this.state.welcomeTimerID);

    // Create the message to display on the screen based on the user action.
    newMessages = this.composeMessage(userAction, coinChange, totalCoin);
    this.setState({actionMessages:newMessages});

    // Reset the display to the welcome message after specified time.
    welcomeTimerID = setTimeout( () => {
      newMessages = this.composeMessage("welcome", 0, totalCoin);
      this.setState({actionMessages:newMessages})
    }, 5000 );
    this.setState({welcomeTimerID:welcomeTimerID}) ;
  }

  // Evaluate inserted coin if its valid then add it to total coin.
  evaluateCoin(insertedCoin){
    let isnertedCoinUp = insertedCoin.toUpperCase();
    let updatedUserAction = 'coin';
    let validCoin = 0;
    if (isnertedCoinUp){
      switch (isnertedCoinUp) {
        case "10C":
          validCoin = .1;
          break;
        case "20C":
          validCoin = .2;
          break;
        case "50C":
          validCoin = .5;
          break;
        case "$1":
          validCoin = 1;
          break;
        case "$2":
          validCoin = 2;
          break;
        default:
          //Invalid coins (5c or unrecognized).
          validCoin = 0;
          updatedUserAction = insertedCoin;
      }
    }
    // Add valid coin value to total coin.
    let newTotalCoin = this.state.totalCoin + Number(validCoin);
    this.setState({totalCoin:newTotalCoin});

    return updatedUserAction;
  }

  // Compose message object to pass to the display based on the provided user action
  composeMessage(userAction, coinChange, totalCoin){
    // Initialize message object
    let newMessages = {
      msgWelcome : "Welcome! Insert coins to start.",
      msgDispenseItem : null,
      msgInvalid5c : null,
      msgInvalidCoin : null,
      msgDispenseCoin : null,
      msgValidCoins : null,
      msgExit : null
    };

    // Populate message object with value or null depending on the User's action.
    switch (userAction) {
      // Show welcome message
      case "welcome":
      case "coin":
        break;

      // Dispense item, change and display exit message.
      case "Organic Raw":
      case "Caramel":
      case "Hazelnut":
        newMessages.msgWelcome = null;
        newMessages.msgDispenseItem = <MessageDiv actionMsg={"Here is your " + userAction + ". Enjoy!"} />
        if(coinChange > 0 ){
          newMessages.msgDispenseCoin = <MessageDiv actionMsg={"Unused coins returned ($" + coinChange.toFixed(2) + ")."} />;
        }
        newMessages.msgExit = <MessageDiv actionMsg="Bye. Until next time." />;
        break;

      // Cancel the transaction and return any change/unused coins.
      case "cancel":
        newMessages.msgWelcome = null;
        if(totalCoin > 0 ){
          newMessages.msgDispenseItem = <MessageDiv actionMsg={"Unused coins returned ($" + totalCoin.toFixed(2) + ")."} />;
        }
        newMessages.msgExit = <MessageDiv actionMsg="Bye. Until next time." />;
        break;

      // Invlalid 5c coin. Inform user that 5c coin is not accepted. Return unused coin and show what are accepted conins.
      case "5c":
      case "5C":
        newMessages.msgWelcome = null;
        newMessages.msgInvalid5c = <MessageDiv actionMsg="Sorry, I can't take this coin (5c)." />;
        newMessages.msgDispenseCoin = <MessageDiv actionMsg="Unused coins returned (5c)" />;
        newMessages.msgValidCoins = <MessageDiv actionMsg="Please insert 10c, 20c, 50c, $1 or $2 coin only." />;
        break;

      // Unrecognized coins are all invlalid. Inform user that the coin is not accepted. Return unused coin and show what are accepted conins.
      default:
        newMessages.msgWelcome = null;
        if(userAction){
          newMessages.msgInvalidCoin = <MessageDiv actionMsg="Sorry, I don't know what to do with that (Invalid coin)." />;
          newMessages.msgDispenseCoin = <MessageDiv actionMsg={"Unused coins returned (" + userAction + ")."} />;
          newMessages.msgValidCoins = <MessageDiv actionMsg="Please insert 10c, 20c, 50c, $1 or $2 coin only." />;
        }
    }
    // Return message object
    return newMessages;
  }

  render() {
    return (
      <div className="App">
        <DivHeading />
        <DivMenu performUserAction={this.performUserAction} totalCoin={this.state.totalCoin} />
        <DivCoin performUserAction={this.performUserAction} totalCoin={this.state.totalCoin} />
        <DivCancel performUserAction={this.performUserAction} />
        <DivDisplay totalCoin={this.state.totalCoin} actionMessages={this.state.actionMessages} userAction={this.state.userAction} />
      </div>
    );
  }
}

//******************************************************************************
// PRESENTATION LOGIC
//******************************************************************************

// Component for Heading
class DivHeading extends Component{
  render(){
    return (
      <header class="wrapper heading">
        <div class="img-left-top"><img src="cacao-top-s.png"></img></div>
        <div class="img-right-bottom"><img src="choco-bottom-s.png"></img></div>
        <div class="title">
          Vegan Chocolate
        </div>
        <div class="subtitle">
          Vending Machine
        </div>
        <div class="language">
          (ReactJS)
        </div>
      </header>
    );
  }
}

// Component for menu item list (snacks).
class DivMenu extends Component{
  constructor(props){
    super(props);
    this.handleSelection1 = this.handleSelection1.bind(this);
  }
  handleSelection1(selection){
    // perform actions with arguments (user action, coin being inserted by action)
    this.props.performUserAction(selection, 0);
  }
  // Assumption: Objects can be created to represent menu items (snacks) with the properties used in MenuItem component. This might be useful when maintaining the menu items in the machine. Not used for simplicity.
  render(){
    return(
      <div class="wrapper wrapper-format">
        <div id="snack-header">
          Hey there! The following snacks are available for you to choose from:
        </div>
        <ul>
          <MenuItem ButtonValue="Organic Raw" MenuItemDescr="Organic Raw ($2.00)" totalCoin={this.props.totalCoin} ItemPrice="2" onSelection2={this.handleSelection1}/>
          <MenuItem ButtonValue="Caramel" MenuItemDescr="Caramel ($2.50)" totalCoin={this.props.totalCoin} ItemPrice="2.5" onSelection2={this.handleSelection1}/>
          <MenuItem ButtonValue="Hazelnut" MenuItemDescr="Hazelnut ($3.10)" totalCoin={this.props.totalCoin} ItemPrice="3.1" onSelection2={this.handleSelection1}/>
        </ul>
      </div>
    );
  }
}

// Menu Item (snacks) in the list.
class MenuItem extends Component{
  constructor(props){
    super(props);
    this.handleSelection2 = this.handleSelection2.bind(this);
  }
  // Handler that calls handler of parent component (DivMenu) to perfom action in main component (App)
  handleSelection2(e){
    this.props.onSelection2(e.target.value);
  }
  render(){
    return(
      <li>
        <div class="dispInLine">
          <button type="button" value={this.props.ButtonValue}  onClick={this.handleSelection2} disabled={(this.props.totalCoin >= this.props.ItemPrice)? false:true}>Select</button>
        </div>
        <div class="dispInLine">
          {this.props.MenuItemDescr}
        </div>
      </li>
    );
  }
}

// Component for Coin slot and coin meter.
class DivCoin extends Component {
  constructor(props){
    super(props);
    this.state = {insertedCoin : ""}
    this.handleInsertCoin = this.handleInsertCoin.bind(this);
    this.handleEvaluateCoin = this.handleEvaluateCoin.bind(this);
    this.handleOnEnter = this.handleOnEnter.bind(this);
  }
  // Handler when value of input changes
  handleInsertCoin(e){
    this.setState({insertedCoin : e.target.value});
  }
  // Handler when button is clicked or "enter" key is pressed.
  handleEvaluateCoin(){
    // Set action only when input field has value.
    if(this.state.insertedCoin){
      // perform actions with arguments (user action, coin being inserted by action)
      this.props.performUserAction("coin", this.state.insertedCoin);
      this.state.insertedCoin = "";
    }
  }
  // Handler to catch "enter" key.
  handleOnEnter(e){
    if (e.keyCode === 13){
      this.handleEvaluateCoin(e);
    }
  }
  render(){
    return(
      <div class="wrapper wrapper-format">
        <div class="coin-valid">
          Please insert 10c, 20c, 50c, $1 or $2 coin only.
        </div>
        <div class="coin-meter dispInLine" id="coinMeter">
          Total: ${(this.props.totalCoin).toFixed(2)}
        </div>
        <div class="coin-slot dispInLine">
          <input type="text" placeholder="Insert Coin" value={this.state.insertedCoin} onChange={this.handleInsertCoin} onKeyUp={this.handleOnEnter}></input>
          <button type="button" onClick={this.handleEvaluateCoin}>Drop</button>
        </div>
      </div>
    );
  }
}

// Component for Cancelin transactions.
class DivCancel extends Component {
  constructor(props){
    super(props);
    this.handleCancel = this.handleCancel.bind(this);
  }
  handleCancel(){
    // perform actions with arguments (user action, coin being inserted by action)
    this.props.performUserAction("cancel", 0);
  }
  render(){
    return(
      <div class="wrapper wrapper-format">
        <div class="cancel-text dispInLine">
          Press 'cancel' if you need to leave and I'll return your unused coins.
        </div>
        <div class="cancel-button dispInLine">
          <button type="button" onClick={this.handleCancel}>Cancel</button>
        </div>
      </div>
    );
  }
}

// Component for displaying messages based on user action.
class DivDisplay extends Component{
  render(){
    return(
      <div class="wrapper wrapper-format displayScreen">
        {this.props.actionMessages.msgWelcome}
        {this.props.actionMessages.msgDispenseItem}
        {this.props.actionMessages.msgInvalid5c}
        {this.props.actionMessages.msgInvalidCoin}
        {this.props.actionMessages.msgDispenseCoin}
        {this.props.actionMessages.msgValidCoins}
        {this.props.actionMessages.msgExit}
      </div>
    );
  }
}

// Reusable component for each messages. Used in App.composeMessage() method.
class MessageDiv extends Component{
  render(){
    return(
      <div class="dispBlock">
        {this.props.actionMsg}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'))
