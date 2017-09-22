import { Component, OnInit } from '@angular/core';
import {ApiAiClient} from "api-ai-javascript";

@Component({
  selector: 'app-my-new-component',
  templateUrl: './my-new-component.component.html',
  styleUrls: ['./my-new-component.component.css']
})
export class MyNewComponentComponent implements OnInit {
  public title:string="Dima";
  public response:string = '';
  public request:string ='';
  public client:ApiAiClient;
  public readings_data:string="I know that you just landed on this screen and didn't spoke to agent yet";
  public messages=[];
  /*
    {message:"Hi Jenny! I'm Ben, your rental budget specialist. I was designed to help you to build your monthly budget for your move to London.",type:"agent"},
    {message:"Would you like to know how much money you will need to live in London?",type:"agent"}
  ];
  */
  public pre_populated:string='Hi';
  constructor() { }

  ngOnInit() {
    this.client = new ApiAiClient({accessToken: '7038fb95c5384508a0886caf841ef9b8'})
    this.client.eventRequest("WELCOME")
    .then((response) => {
      this.handleAPIAIresponse(response);
    })
    .catch((error) => {
      console.log(error);
      this.response="sorry but something went wrong, try again in few minutes";
    })
  }
 

  SubmitRequest(box_value){
    let retVal;
    // show the message on screen
    this.request=box_value;
    this.messages.push({message:this.request,type:"me"});
    console.log('request = ' + this.request);

    if(box_value=="I am from Berlin"){
       retVal= "ready";
    }
    else if(box_value=="ready"){
       retVal= "I want to learn about Moorgate";
    }
    else if(box_value=="I want to learn about Moorgate"){
       retVal= "I want to stay room";
    }
    else if(box_value=="I want to stay room"){
       retVal= "add";
    }
    else if(box_value=="add"){
       retVal= "commuting";
    }
    else if(box_value=="commuting"){
       retVal= "tube";
    }
    else if(box_value=="tube"){
       retVal= "I am happy with this choice";
    }
    else if(box_value=="I am happy with this choice"){
       retVal= "2 times a week";
    }
    else if(box_value=="2 times a week"){
       retVal= "no";
    } 
    else {
       retVal= "";      
    }
      


    // send message to API AI and handle the response
    this.client.textRequest(this.request)
    .then((response) => {
      this.handleAPIAIresponse(response);
    })
    .catch((error) => {
      console.log(error);
      this.response="sorry but something went wrong, try again in few minutes";
    })
    return retVal;   
  }
 
  handleAPIAIresponse(response){
    console.log(response);
    this.response=response.result.fulfillment.speech;
    let responsemessage=this.response.split("$$$");
    responsemessage.forEach(element => {
      if(element!=""){
        this.messages.push({message:element,type:"agent"});
      }
    });
    this.readings(response);
    this.ScrollDown();    
    
    let fire_event=response.result.fulfillment.data.fire_event;
    
    // if we want to fire specific event
    if(fire_event!=""){
      this.client.eventRequest(fire_event)
      .then((response) => {
        this.handleAPIAIresponse(response);
      })
      .catch((error) => {
        console.log(error);
        this.response="sorry but something went wrong, try again in few minutes";
      })
    }
    console.log(this.messages); 
  }

  ScrollDown() {
      setTimeout(function(){
        var objDiv = document.getElementById("chatHeight");
        objDiv.scrollTop = objDiv.scrollHeight;
      },200);
      setTimeout(function(){
        var objDiv = document.getElementById("chatHeight");
        objDiv.scrollTop = objDiv.scrollHeight;
      },400);
      setTimeout(function(){
        var objDiv = document.getElementById("chatHeight");
        objDiv.scrollTop = objDiv.scrollHeight;
      },1000);
    }

  public readings(response) {
    this.readings_data="";
    if(response.result.fulfillment){
      if(response.result.fulfillment.data){
        let data =response.result.fulfillment.data;
        if(data.action=='input.city'){
            this.readings_data="I know you moving to "
            +  data.distination_city 
            + " and you are moving from "
            + data.original_city 
            + " and i can show here some readings regarding it";
        }
        else if(data.action=='input.city.rent'){
            this.readings_data="I know that now you asked to see rent budget in "
            +  data.distination_city 
            + " and i can show here some readings regarding it";
        }
        else if(data.action=='input.neighborhood'){
            this.readings_data="I know that now you picked neighborhood "
            +  data.distination_Neighborhood 
            + " and i can show here some readings regarding it";
        }
        else if(data.action=='input.typeofflat'){
            this.readings_data="I know that now you picked type of flat "
            +  data.distination_type_of_flat 
            + " and i can show here some readings regarding it";
        }
        
      }
      
    }
  }
}
