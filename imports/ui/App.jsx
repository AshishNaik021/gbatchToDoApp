import React, {Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '/imports/api/tasks.js';


class App extends Component{
	//======  Section 1 ========
	// All lifecyle classes
	constructor(props){
		super(props);

		this.state = {
			"inputValue" : "",
			"taskid" : "",
			"operation" : "insert",
			"doneClass" : "",
		};		

	}


	//======  Section 2 ========
	// User defined events

	showTasks(){
		return this.props.allTasks.map(
							(t)=>{
									return( <li key={t._id}> 
															<span id={t._id} className={t.status=="completed"?"done":""}> {t.task} </span>
															<span id={"del-"+t._id} className="del" onClick={this.deleteTask.bind(this)}> x </span>
															<span id={"edit-"+t._id} data-task={t.task} className="del" onClick={this.editTask.bind(this)}> E </span>
															<span id={"done-"+t._id} className="del" onClick={this.doneTask.bind(this)}>{t.status=="completed"?"New":"Done"}</span>
													</li> );
							 }
					 );
	}

	doneTask(event){
		event.preventDefault();
		var taskid = event.currentTarget.id;
		var tid = taskid.split("-");

		var text = event.currentTarget.textContent;

		if(text == "New"){
			var status = "new";
		}else{
			var status = "completed";
		}

		Tasks.update(
			{"_id":tid[1]},
			{$set : {"status":status} },
			(error,result)=>{
				if(error){
					console.log("error = ",error);
				}
				if(result){
					console.log("Status Changed to Completed!");
				}
			}
		);


	}

	editTask(event){
		event.preventDefault();
		var taskid = event.currentTarget.id;
		var tid = taskid.split("-");

		var taskVal = event.target.getAttribute("data-task");
		this.setState({"inputValue" : taskVal, "taskid":tid[1], "operation":"edit"});
	}

	deleteTask(event){
		event.preventDefault();

		var r = confirm("Are you sure you want to Delete this Task?")
		if (r == true) {
		  var txt = "You pressed OK!";
			var taskid = event.currentTarget.id; 
			var t = taskid.split("-");
			Tasks.remove({"_id":t[1]});

		} else {
		  var txt = "You pressed Cancel!";
		}

	}


	handleSubmit(event){
		event.preventDefault();
		var inputTask = this.refs.task.value;
		
		if(this.state.operation == "insert"){
			Meteor.call("insertTasks",inputTask,
										(err,rslt)=>{
											if(err){
												console.log("Something went wrong! Error = ", error);
											}
											if(rslt){
												alert("Task inserted Successfully!");
												this.setState({"inputValue":""});
											}
										});	
		}

		if(this.state.operation == "edit"){
			Tasks.update({"_id":this.state.taskid},
					{$set: 	{
										"task" : inputTask,
										"createdAt" : new Date(),
									} 
					}
					,(error,result)=>{
						if(error){
							console.log("error = ", error);
						}
						if(result){
							console.log("result = ",result);
							alert("Task Edited Successfully");
							this.setState({"inputValue":"", "operation":"insert","taskid":""});
						}
				});			

		}


	}

	handleChange(event){
		event.preventDefault();

		var newInput = event.currentTarget.value;
		this.setState({"inputValue" : newInput});
	}


	//======  Section 3 ========
	render(){
		return (
			/*==== Here goes your html ====*/
			<div className="container">
	    	<h1> To Do List <span className="smallTxt"> ({this.props.completed} completed out of {this.props.total} Tasks) </span> </h1> 
	    	<hr className="redLine" />

	    	<form onSubmit={this.handleSubmit.bind(this)}>
	    		<input value={this.state.inputValue} onChange={this.handleChange.bind(this)} className="taskInp" type="text" ref="task" placeholder="Enter Your Task..."/>
	    	</form>

	    	<ul className='todolist'> 
	    		{ this.showTasks() }
	    	</ul>
	    </div>
		);
	};
}


export default withTracker(()=>{
	Meteor.subscribe("tasksData");

	return {
		"allTasks" 			: Tasks.find({},{sort:{"createdAt":-1}}).fetch(),
		"total"					: Tasks.find({}).count(),
		"completed"			: Tasks.find({"status":"completed"}).count(),
	}
})(App);