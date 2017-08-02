import React, { Component } from 'react';
import { connect } from 'react-redux';

// Child components
import Header from './Header/Header';
import Footer from './Footer/Footer';

// Import static files
import './Layout.css';


export class Home extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div className="layoutWrapper">
        <Header/>
        {this.props.children}
        <Footer/>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user
  }
}

export default connect(mapStateToProps)(Home);
