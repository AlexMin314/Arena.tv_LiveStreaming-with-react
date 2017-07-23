import React, {Component} from 'react';

// Import CSS
import './SocialBtn.css';

class SocialBtn extends Component {
  render() {
    return (
      <div className="row" id="SocialBtnWrapper">
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="ifacebook" title="Facebook"><i className="fa fa-facebook" /></a>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="itwittter" title="Twitter"><i className="fa fa-twitter" /></a>
          </div>
        </div>
        <div className="col-4 text-center">
          <div className="icon-circle">
            <a href="#" className="igoogle" title="Google+"><i className="fa fa-google-plus" /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default SocialBtn;
