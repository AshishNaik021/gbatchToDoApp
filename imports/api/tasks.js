import { Mongo } from 'meteor/mongo';

export const Tasks = new Mongo.Collection('tasks');

if(Meteor.isServer){
	Meteor.publish("tasksData",function(){
		return Tasks.find({"status":"new"},{sort:{"createdAt":-1}},{limit:30});
	});
}

Meteor.methods({
	"insertTasks" : function(inputTask){
			Tasks.insert({
				"task" : inputTask,
				"status" : "new",
				"createdAt" : new Date(),
			},(error,result)=>{
					if(error){
						console.log("error = ", error);
						return error;
					}
					if(result){
						console.log("result = ",result);
						return result;
					}
			});	
	}


});
