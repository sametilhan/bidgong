import React, { Component } from 'react';
import { connect } from 'react-redux';
import Layout from './Layout';
import {Link} from 'react-router-dom';

class PaymentSuccess extends Component {
  render() {

    return (
      <Layout {...this.props}>
       <div className="row">
            <div className="col-lg-12 col-md-12 pay-steps">
                <ul class="pay-steps">
                    <li className="future">REVIEW YOUR</li>
                    <li className="future">ORDER PAYMENT</li>
                    <li className="current">FINISH</li>
                </ul>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 col-md-12 pay-success">
                <i class="far fa-check-circle"></i>
                <h2>SUCCESS</h2>
                <p>Check the result in notifications after
                    finish the match</p>
                    <Link to="/"><button type="submit" class="btn btn-primary mx-auto">DONE</button></Link>
            </div>
        </div>
      </Layout>
    )
  }
}

const mapStateToProps = ({paymentSuccess}) =>{
  return {
    paymentSuccess,
    fetched : true,
    bodyClass : 'pay'
  };
}

export default connect(mapStateToProps)(PaymentSuccess);