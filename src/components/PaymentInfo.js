import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutHOC from './LayoutHOC';
import {Link} from 'react-router-dom';
import {sendPayment} from '../actions/SendPaymentAction';
import {ToastsContainer, ToastsStore} from 'react-toasts';
import CreditCardInput from 'react-credit-card-input';

class PaymentInfo extends Component { 

  constructor(props) {
    super(props);
    this.sendPaymentInfo = this.sendPaymentInfo.bind(this);
  }
  
  // componentDidUpdate() {  
  //   if(this.props.fetched)
  //   {
      
  //   } 
  // }

  async sendPaymentInfo(event) {  
    event.preventDefault();

    // var paymentInfos = {
    //   "productId": "0aa30475-58e5-44e0-a13f-2a626cc293d2",
    //   "userId": "0aa30475-58e5-44e0-a13f-2a626cc293d2",
    //   "nameSurname": "test test",
    //   "cardNumber": "4355084355084358",
    //   "cardExpireMonth": "12",
    //   "cardExpireYear": "2019",
    //   "cardCvvNumber": "000"
    // }

    var paymentInfos = {
      "activeMatchId": this.props.winner.result.MatchId,
      "teamId":this.props.winner.result.TeamId,
      "playerId":this.props.winner.result.PlayerId,
      "userMail": this.props.user.email,
      "price":this.props.winner.result.Price,
      "adress":null,
      "nameSurname":this.refs.inputNameSurname.value,
      "cardNumber":this.refs.inputCardNumber.value,
      "cardExpireMonth": this.refs.inputCardExpireMonth.value,
      "cardExpireYear": this.refs.inputCardExpireYear.value,
      "cardCvvNumber": this.refs.inputCardCvvNumber.value
    }

    await this.props.onSendPayment(paymentInfos);

    if(!this.props.paymentInfoFetched && this.props.paymentInfo !== null&& typeof(this.props.paymentInfo) !== "undefined" && this.props.paymentInfo.hasOwnProperty('error'))
    {
      ToastsStore.error(this.props.paymentInfo.error.message);
    }

    if(this.props.paymentInfoFetched)
    {
      if(this.props.paymentInfo.result.entityData.status!=="SUCCESS")
      {
        ToastsStore.error(this.props.paymentInfo.result.entityData.mdErrorMessage);
      }
      else
      {         
        ToastsStore.success("Payment Succeed");
      }      
    }
  }

  render() {

    return (
      <div>
       <div className="row">
            <div className="col-lg-12 col-md-12 pay-steps">
                <ul class="pay-steps">
                    <li className="visited"><Link to="/player">REVIEW YOUR</Link></li>
                    <li className="current">ORDER PAYMENT</li>
                    <li className="future">FINISH</li>
                </ul>
            </div>
        </div>
        <div className="row">
            <div className="col-md-5 col-lg-5 mx-auto text-center">
                <form className="mb-3">
                    <div className="form-group d-flex">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" ref="inputNameSurname"
                               placeholder="Name Surmane on card..." value="4355084355084358" />
                    </div>
                    <div className="form-group d-flex">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" ref="inputCardNumber"
                               placeholder="CardNumber..." value="4355084355084358" />
                    </div>
                    <div className="form-group d-flex">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" ref="inputCardExpireMonth"
                               placeholder="ExpireMonth..." value="12" />
                    </div>
                    <div className="form-group d-flex">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" ref="inputCardExpireYear"
                               placeholder="ExpireYear..." value="2019" />
                    </div>
                    <div className="form-group d-flex">
                        <input type="text" class="form-control flex-fill mr-0 mr-sm-2 mb-3 mb-sm-0" ref="inputCardCvvNumber"
                               placeholder="CardCvvNumber..." value="000" />
                    </div>
                    <Link to="/paymentinfo"><button type="submit" onClick={this.sendPaymentInfo} className="btn btn-primary mx-auto">PAY NOW</button></Link>
                </form>
            </div>
        </div>
        <ToastsContainer store={ToastsStore}/>
      </div>
    )
  }
}

const mapStateToProps = ({paymentInfo,winner}) =>{
  return {
    paymentInfo,
    paymentInfoFetched : paymentInfo ===null|| typeof(paymentInfo) === "undefined" ? false : paymentInfo.fetched,
    winner,
    fetched : true,
    bodyClass : 'pay'
  };
}

const mapDispatchToProps = {
  onSendPayment: sendPayment
};


export default connect(mapStateToProps,mapDispatchToProps)(LayoutHOC(PaymentInfo));