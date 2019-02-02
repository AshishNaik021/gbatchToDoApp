import React, {Component} from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '/imports/api/tasks.js';


class App extends Component{
	//======  Section 1 ========
	// All lifecyle classes


	//======  Section 2 ========
	// User defined events
	getToDoList(){
		var todolist = [
			{id:1, task:"Attend The Great ReactJS Training!"},
			{id:2, task:"Lets Do Shopping in Amanora Mall"},
			{id:3, task:"Agent Jacks is Calling"},
			{id:4, task:"Now Time for Pizza"},
			{id:5, task:"Going to sleep... Bye!"},
		];

		return todolist;
	}

	showTasks(){
		console.log("this.props.allTasks = ", this.props.allTasks);
		return this.props.allTasks.map(
							(t)=>{
									return( <li key={t._id}> {t.task} </li> );
							 }
					 );
	}

	handleSubmit(event){
		event.preventDefault();
		var inputTask = this.refs.task.value;
		console.log("inputTask = ",inputTask);

		Tasks.insert({
			"task" : inputTask,
			"createdAt" : new Date(),
		},(error,result)=>{
				if(error){
					console.log("error = ", error);
				}
				if(result){
					console.log("result = ",result);
					this.refs.task.value = "";
				}
		});

	}

	//======  Section 3 ========
	render(){
		console.log(this.props);

		return (
			/*==== Here goes your html ====*/
			<div className="container">
	    	<h1> To Do List </h1>
	    	<hr className="redLine" />

	    	<form onSubmit={this.handleSubmit.bind(this)}>
	    		<input className="taskInp" type="text" ref="task" placeholder="Enter Your Task..."/>
	    	</form>

	    	<ul className='todolist'> 
	    		{ this.showTasks() }
	    	</ul>
	    </div>
		);
	};
}


export default withTracker(()=>{
	return {
		"allTasks" 			: Tasks.find({},{sort:{"createdAt":-1}}).fetch(),
	}
})(App);