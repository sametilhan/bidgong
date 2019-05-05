import React, { Component } from 'react';
import { connect } from 'react-redux';
import LayoutHOC from './LayoutHOC';
import {Link} from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import {getMatch} from '../actions/GetMatchAction';
import {setMatchBet} from '../actions/SetMatchBet';
import PubNubReact from 'pubnub-react';

class SelectedMatch extends Component {

  constructor(props) {
    super(props)
    this.pubnub = new PubNubReact({
      publishKey: 'pub-c-1ba62178-7b93-4e40-bbcf-39570315b5ee',
      subscribeKey: 'sub-c-7d57f2f4-37bc-11e9-b5cf-1e59042875b2'
    });
    this.pubnub.init(this);
  }
  

  selectedTeamName = "";
  updateForce = false;

  selectTeamName=(selectedTeamName)=>{
      this.selectedTeamName = selectedTeamName;
      this.forceUpdate();
  };

  lowerCaseLetter=(object)=>{
      var res = Object.keys(object).reduce((c, k) => (c[k.toLowerCase()] = object[k], c), {});
      return res;
  };


  async componentWillMount() {
    if(this.props.match.params.id!==undefined && this.props.match.params.id !=="")
    {
       await this.props.onGetMatch(this.props.match.params.id);

       this.selectTeamName(this.props.currentMatch.detail.homeTeam.teamName);

        // currentBet = this.props.playerBetPrice;
        this.pubnub.subscribe({
          channels: [this.props.match.params.id],
          withPresence: true
        });

        this.pubnub.getMessage(this.props.match.params.id, (channel) => {
          // console.log(channel);
          this.props.onSetMatchBet(channel.message);
        });   
    }
  }

  // componentDidMount() {
  // }

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  render() {

    let documentBody = "";

    const selectedTeam = this.props.match.params.teamName!==undefined && this.props.match.params.teamName !=="" ? 
    this.props.match.params.teamName : this.selectedTeamName;
    if(selectedTeam!==this.selectedTeamName)
    {
      this.selectTeamName(this.props.match.params.teamName);
    }
    
    let durationPlayers = "";
    let durationTeams = "";
    let durationTeamsDots = "";
    let durationTeamsCompare = "";
    let durationBetPlayers = "";
    if(this.props.fetched === true){
      const teams = [];
      teams.push(this.props.currentMatch.detail.homeTeam);
      teams.push(this.props.currentMatch.detail.guestTeam);
      const teamName = this.selectedTeamName;
      let currentTeam = {};
      currentTeam =  teams.find(data => data.teamName === teamName);
      if(typeof(currentTeam) !== "undefined")
      {
          const currentTeam = this.props.currentMatch.detail.homeTeam.teamName === teamName ?
          this.props.currentMatch.detail.homeTeam
          :this.props.currentMatch.detail.guestTeam;

          durationPlayers = currentTeam.players.map((item, i) => {
            var divPlayerStyle = {
              backgroundImage: `url(${ item.playerImageUrl })`             
            };
            const footballPlayer = `footballPlayer${i+1}`;
              return (
                  i===0?
                  <Link key={i} to={`/betplayer/${this.props.match.params.id}/${item.playerGuid}`}><div data-tip={item.playerName} style={divPlayerStyle} 
                  className={`football-uniform-keeper ${footballPlayer}`}></div></Link>
                  :
                  <Link key={i} to={`/betplayer/${this.props.match.params.id}/${item.playerGuid}`}><div data-tip={item.playerName} style={divPlayerStyle} 
                  className={`football-uniform ${footballPlayer}`}></div></Link>
              );
          });
          var divStyle = {
            width: '355px',
            height:'188px'
          };

          durationTeams =
            <div className="row team-list-big">
              <div className="col-lg-4 col-md-4">
              <img src={this.props.currentMatch.detail.homeTeam.teamFlagUrl} className="img-fluid" alt="" style={divStyle} />
                {this.props.currentMatch.detail.homeTeam.teamName}
              </div>
              <div className="col-lg-4 col-md-4 score">1:1</div>
              <div className="col-lg-4 col-md-4">
              <img src={this.props.currentMatch.detail.guestTeam.teamFlagUrl} className="img-fluid" alt="" style={divStyle} />
                {this.props.currentMatch.detail.guestTeam.teamName}
              </div>
          </div>

          durationTeamsDots =teams.map((item, i) => {
            var classNameCurrent = i ===0  ? "col-md-6 no-padding text-right" : "col-md-6 no-padding text-left";
            var classSelected = item.teamName ===currentTeam.teamName  ? "fas fa-circle color-white" : "fas fa-circle";
            var classFieldLink = i ===0  ? "fieldLink1" : "fieldLink2";
              return (
                <div key={i} className={classNameCurrent}>
                  <Link to={`/currentmatch/${this.props.match.params.id}/${item.teamName}`} className={classFieldLink}>
                  <i className={classSelected}></i></Link>
                </div>
              );
          });

          durationTeamsCompare =  
          <div className="row">
          <div className="col-lg-12 col-md-12">
                  <div className="compare">
                      <div className="time">55:33</div>
                      <div className="team-flag-left"><img src={currentTeam.teamFlagUrl} className="img-fluid" alt="" width="70" /></div>
                      <div className="team-name">{currentTeam.teamName.toUpperCase()}</div>
                      <div className="team-flag-right"><img src={currentTeam.teamFlagUrl} className="img-fluid" alt="" width="70" /></div>
                  </div>
              </div>
          </div>        

          durationBetPlayers =  
          <div className="row">
              <table className="compare-table">
                <tbody>
                  {currentTeam.players.map((item, i) => {
                      return (
                        <tr key={i}>
                            {/* <td></td> */}
                            <td>{item.playerName.toUpperCase()}</td>
                            <td>{item.betPrice}$</td>
                        </tr>
                      );
                  })}
                </tbody>               
              </table>
          </div>
      }
      
    }

    documentBody = this.props.fetched ? 
    <div>
      {durationTeams}
      <div className="row">
      <div className="col-lg-12 col-md-12">
      </div>
      </div>
      <div className="row">
          <div className="col-lg-12 col-md-12">
              <div className="field-football">
                  {durationPlayers}                
              </div>
            </div>
      </div>
      <div className="row mt-3 dots">
        {durationTeamsDots}
      </div>      
      {durationTeamsCompare}
      {durationBetPlayers}
      <ReactTooltip />
    </div>
    : "";
   
    return (
      documentBody
    )
  }
}

const mapStateToProps = ({currentMatch}) =>{
  return {
    currentMatch: currentMatch.result,
    fetched: currentMatch.fetched,
    error: currentMatch.error,
    bodyClass : 'pages'
  };
}

const mapDispatchToProps = {
  onGetMatch: getMatch,
  onSetMatchBet : setMatchBet
};

export default connect(mapStateToProps,mapDispatchToProps)(LayoutHOC(SelectedMatch));