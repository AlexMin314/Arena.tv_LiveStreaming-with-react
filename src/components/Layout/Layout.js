import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

// Child components
import Header from '../Partials/Header/Header';
import Footer from '../Partials/Footer/Footer';

// Import static files
import './Layout.css';

/**
 * App's Index Page
 */
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
  return {}
}

export default connect(mapStateToProps)(Home);
