import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, List, Card, Label, Button, Segment } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData() {
        var jobData = this.state.jobData;
        var link = 'http://localhost:51689/listing/listing/getEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here

       $.ajax({
        url: link,
        headers: {
            'Authorization': 'Bearer ' + cookies,
            'Content-Type': 'application/json'
        },
        type: "GET",
        contentType: "application/json",
        dataType: "json",
       // data: JSON.stringify(jobData),
       
        success: function (res) {
            //let jobData = null;
          if(res){
            this.setState({
                jobData: res.myJobs
            })
            console.log(res.myJobs)
          }
          
          else{
            console.log("No jobs found")
          }
        }.bind(this)
    })
    }
    closeEdit() {
      this.setState({
          showEditSection: false
      })
  }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {
        var {jobData} = this.state;
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData} jobData = {this.state.jobData}>
              <div><h2 style={{marginLeft: 185}}>List of jobs</h2>
                <List horizontal>
                    <List.Item>
                    <Icon style={{marginLeft: 185}} name = "filter"> </Icon>
                    <label>Filter:</label>
                    </List.Item>
                    <List.Item>
                        <Dropdown  text = "Choose filter"></Dropdown>
                    </List.Item>
                    <List.Item>
                        <Icon name = "calendar alternate"></Icon>
                    <label >Sort by date: </label>
                    </List.Item>
                    <List.Item>
                        <Dropdown text = "Newest first"></Dropdown>
                    </List.Item>
                </List>
                
                <Card.Group style={{marginLeft: 185}}   >
               {jobData && jobData.length === 0 ?    
                  
                 
                  (<label style={{marginTop: 20}}>No Jobs found</label>
                  ):
                (jobData && jobData.map((s) =>{
                    return(

                  
    <Card  key = {s.id} style = {{width: "380px", height: "350px"}}>
  
      <Card.Content >
        
        <Card.Header >{s.title}</Card.Header>
        <Label ribbon  = 'right' color='black'><Icon name = 'user'></Icon> 0</Label>
        <Card.Meta >{s.location.city}, {s.location.country}</Card.Meta>
        <Card.Description >
          {s.summary}
        </Card.Description>
        
      </Card.Content>
      <Card.Content extra >
      
        <div className='ui four buttons' >
        
        <Button style = {{ padding:5, width: "10px" }} color = 'red'>Expired</Button>
          <Button style = {{ marginLeft: 50, padding:5, width: "10px" }} basic color='blue' onClick={this.closeEdit}><Icon name = 'ban'/>
            Close
          </Button>
          <Button style = {{ padding:5, width: "10px" }} basic color='blue'><Icon name = 'edit'/>
            Edit
          </Button>
          <Button style = {{ padding:5, width: "10px" }} basic color='blue'><Icon name = 'copy'/>
            Copy
          </Button>
        </div>
      </Card.Content>
      
    </Card>
      )
    }))}
        </Card.Group>
        <div>{jobData && jobData.length === 0 ?
        (<Pagination style ={{marginTop: 60, marginLeft: 600}} totalPages={0} />):
        (<Pagination style ={{marginTop: 30, marginLeft: 600}} defaultActivePage={1} totalPages={1} />)
    }
        </div>
                </div>
               
            </BodyWrapper>
        )
    }
}