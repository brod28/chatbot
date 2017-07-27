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
  public messages=[
    {message:"Hello, I am rent budget specialist and want to help you with your move to London, please let me know where are you moving from?",type:"agent"},
  ];
  constructor() { }

  ngOnInit() {
    this.client = new ApiAiClient({accessToken: 'b266cf849ba2485a96dcdcee069f60d2'})
  }
 
  SubmitRequest(){
    console.log('request = ' + this.request);
    this.client.textRequest(this.request)
    .then((response) => {
      this.response=response.result.fulfillment.speech;
      this.messages.push({message:this.request,type:"me"});
      this.messages.push({message:this.response,type:"agent"});
      if(this.messages.length>4){
        this.messages.shift();
      }
      if(this.messages.length>4){
        this.messages.shift();        
      }
      this.readings(response);
      console.log(this.messages);      
    })
    .catch((error) => {
      this.response=error;
    })
  }
  /**
   * name
   */
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
