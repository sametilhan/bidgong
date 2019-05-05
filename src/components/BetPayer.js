import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutHOC from './LayoutHOC';
import {Link} from 'react-router-dom';
import {getPlayer} from '../actions/GetPlayerAction';
import {betPlayer} from '../actions/BetPlayerAction';
import {setPlayerBet} from '../actions/SetPlayerBet';
import {BET_VALUE} from '../config/Config';
import PubNubReact from 'pubnub-react';
import {ToastsContainer, ToastsStore} from 'react-toasts';

let playerGuid="BEEFFB29-A07E-497B-97CC-6C7A02C67419";
let currentBet = 0;
class BetPlayer extends Component {
 
  constructor(props) {
    super(props)
     playerGuid = this.props.match.params.id;
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1ba62178-7b93-4e40-bbcf-39570315b5ee',
      subscribeKey: 'sub-c-7d57f2f4-37bc-11e9-b5cf-1e59042875b2'
    });
    this.pubnub.init(this);
  }

  async componentWillMount() {    
    await this.props.onGetPlayer(this.props.match.params.matchid,playerGuid);
    // console.log(this.props.player)

    // currentBet = this.props.playerBetPrice;
    this.pubnub.subscribe({
      channels: [playerGuid],
      withPresence: true
    });

    this.pubnub.getMessage(playerGuid, (channel) => {
      let player = {
        ...this.props.player,
        betPrice : channel.message
      }
       this.props.onSetPlayerBet(player);
    });
  }
  
  
  // componentDidMount() {
   
  // }

  componentDidUpdate() {  
    if(this.props.fetched && this.props.betPlayerFetched)
    {
      if(this.props.betPlayer.isError)
      {
        ToastsStore.error(this.props.betPlayer.message);
      } 
    } 
    
    if(this.props.fetched)
    {
      this.refs.hdnPlayerIncrease.innerHTML = currentBet === 0 ? "" : "+" +currentBet + "$";
    } 
  }
  
  componentWillUnmount() {
    this.pubnub.unsubscribe({
      channels: [playerGuid]
    });
  }

  betPlayerIncrease=()=>{      
    currentBet += BET_VALUE;   
    this.refs.hdnPlayerIncrease.innerHTML = "+" +currentBet + "$"; 
  };

  betPlayerDecrease=()=>{             
    currentBet -= BET_VALUE; 
    if(this.props.playerBetPrice + currentBet <= this.props.playerBetPrice)
    {
      currentBet = 0;
    }

    this.refs.hdnPlayerIncrease.innerHTML = currentBet === 0 ? "" : "+" +currentBet + "$";
  };

  betPlayer=(event)=>{   
    event.preventDefault(); 
    if(this.props.playerBetPrice + currentBet === this.props.playerBetPrice)
    {
      ToastsStore.error("Bet verebilmeniz için değeri arttırmalısınız");
    }
    else
    {
      let betVal = {
        "userMail": this.props.user.email,
        "betPrice": this.props.player.betPrice + currentBet,
        "matchGuid": this.props.match.params.matchid,
        "playerGuid":this.props.match.params.id
      }
  
      this.props.onBetPlayer(betVal);  
      currentBet = 0;
    }    
  };

 
  render() {
    var documentBody = this.props.fetched ? 
    <div>
      <div className="row">
          <div className="col-lg-12 col-md-12 pay-success">
          <h5>{this.props.player.playerName} </h5>
          </div>
      </div>
      <div className="row bid-link">
          <div className="col-lg-5 col-md-5 text-right">
              <Link to="#" onClick={this.betPlayerDecrease}><i className="fas fa-minus-circle font-size-40 lh-250"></i></Link></div>
          <div className="col-lg-2 col-md-2 pay-success">
              <img src="/assets/img/football.png" className="img-fluid" width="200" alt=""/>
          </div>
          <div className="col-lg-5 col-md-5 text-left">
              <Link to="#" onClick={this.betPlayerIncrease}><i className="fas fa-plus-circle font-size-40 lh-250"></i></Link></div>
      </div>
      <div className="row">
          <div className="col-lg-12 col-md-12 pay-success">
              <h2 >{this.props.playerBetPrice}$<span style={{color: "green",marginLeft:"50px"}} ref="hdnPlayerIncrease">{this.props.currentBet}$</span></h2>
              <button onClick={this.betPlayer} type="submit" className="btn btn-primary mx-auto">BID</button>
          </div>
      </div>
      <ToastsContainer store={ToastsStore}/>
    </div>
    :
   ""
    return (
      documentBody      
    )
  }
}

const mapStateToProps = ({betPlayer,user,player}) =>{
  return {
    betPlayer:betPlayer.result,
    betPlayerFetched : betPlayer.fetched,
    player : player.result,
    playerBetPrice : player.fetched ? player.result.betPrice : 0,
    user : user.userInfo == null ? null : user.userInfo,
    userFetched:user.fetched,
    userLoggedIn : user.userInfo==null ? false : true,
    fetched : player.fetched,
    bodyClass : 'pay'
   
  };
}

const mapDispatchToProps = {
  onGetPlayer: getPlayer,
  onBetPlayer: betPlayer,
  onSetPlayerBet : setPlayerBet
};


export default connect(mapStateToProps,mapDispatchToProps)(LayoutHOC(BetPlayer));