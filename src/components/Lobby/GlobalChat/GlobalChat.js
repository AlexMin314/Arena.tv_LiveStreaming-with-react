import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import './GlobalChat.css';

export class GlobalChat extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props){
    super(props);
    this.state = {
      msg: ''
    }
  }

  // Helper function for auto scrolling.
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView();
  }

  /**
   * LifeCycle
   */

   componentDidMount() {
     this.scrollToBottom(); // auto scroll down.
   };

   componentDidUpdate() {
     this.scrollToBottom(); // auto scroll down.
   };

  /*
   * Event Listeners
   */

  onChange = (e) => {
    console.log(e.target.value);
    this.setState( {msg : e.target.value} );
  };

  onKeypress = (e) => {
    if (e.key === 'Enter' && this.state.msg !== '') {
      console.log('Enter Pressed : ', e.value);
      this.setState({msg:''});
    }
  };

  onClick = (e) => {
    if (this.state.msg !== '') {
      console.log('Msg sent! : ', this.state.msg)
      this.setState({msg:''});
    }
  };

  render() {

    return (
      <div className="globalChatWrapper">
        {/* Chat Display Field */}
        <div className="globalChatInnerWrapper">
          <div className="testChat">This is First text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is test chat text.</div>
          <div className="testChat">This is Last text.</div>
          {/* Auto scroll to the last */}
          <div id="messagesEnd"
               ref={(el) => this.messagesEnd = el} />
        </div>
        {/* Input Field */}
        <div className="row input-group chatInput">
        <span className="input-group-addon" id="basic-addon1"></span>
            <input id="btn-input"
                   type="text"
                   className="form-control input"
                   placeholder="Type your message here..."
                   onChange={this.onChange}
                   value={this.state.msg}
                   onKeyPress={this.onKeypress}/>
            <span className="input-group-btn">
              <button className="btn btn-warning"
                      id="btn-chat"
                      onClick={this.onClick}>
                      Send
              </button>
            </span>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // nothing to see here...
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalChat);
