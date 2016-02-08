using System;
using RestSharp; 

/* This file is used to interact with the 
 * server database store. 
 */
using System.Collections.Generic;
using System.Linq;

using Newtonsoft.Json.Linq; 

 
namespace tBpShared
{
	public class EntityRepositoryImpl : EntityRepository
	{

		T Execute<T>(IRestRequest request)
		{
			var response = ((MobileRestClient) Client).ExecuteAbstract<T> (request); 

			if (response.ErrorException != null) {
				const string message = "Error retrieving response. Check inner details for more info.";
				var exception = new ApplicationException (message, response.ErrorException); 
				throw exception;
			}

			return response.Data; 
		}



		bool Execute(IRestRequest request)
		{
			var response = Client.Execute (request); 
			return response.ErrorException != null; 
		}

		public override void AssignClient(Uri url, string token)
		{
			BaseURL = url; 
			AccessToken = token; 
			Client = new MobileRestClient (url.ToString ()); 
			Client.AddDefaultHeader ("x-access-token", AccessToken); 
		}

		public override List<User> getUsers() 
		{ 
			var request = new RestRequest ("users", Method.GET); 
			return Execute<List<User>> (request); 
		}

		public override List<User> getUsers(Func<User, bool> condition) 
		{
			return getUsers ().Where (condition).ToList(); 
		}

		public override List<Event> getEvents() 
		{ 
			var request = new RestRequest ("events", Method.GET); 
			return Execute<List<Event>> (request); 
		}

		public override List<Event> getEvents(Func<Event, bool> condition) 
		{
			return getEvents ().Where (condition).ToList(); 
		}

		public override List<Event> getEventsForUser(int userId) 
		{ 
			var request = new RestRequest ("users/{id}/events", Method.GET); 
			request.AddUrlSegment("id", userId.ToString());

			return Execute<List<Event>> (request); 
		}

		public override List<User> getUsersForEvent(int eventId) 
		{ 
			var request = new RestRequest ("events/{id}/users", Method.GET); 
			request.AddUrlSegment("id", eventId.ToString());

			return Execute<List<User>> (request); 
		}

		public override User getUser(int userId) 
		{ 
			var request = new RestRequest ("users/{id}", Method.GET); 
			request.AddUrlSegment("id", userId.ToString());

			return Execute<User> (request); 
		}

		public override Event getEvent(int eventId) 
		{ 
			var request = new RestRequest ("events/{id}", Method.GET); 
			request.AddUrlSegment ("id", eventId.ToString()); 

			return Execute<Event> (request); 
		}

		public override bool addUser(User user) 
		{ 
			var request = new RestRequest ("users", Method.POST); 
			Client.Execute (request); 

			return Execute (request); 
		}

		public override bool addEvent(Event e) 
		{ 
			var request = new RestRequest ("events", Method.POST); 

			return Execute (request); 
		}

		public override bool deleteUser(int userId) 
		{
			var request = new RestRequest ("users/{id}", Method.DELETE); 
			request.AddUrlSegment ("id", userId.ToString()); 

			return Execute (request); 
		}

		public override bool deleteEvent(int eventId) 
		{
			var request = new RestRequest ("users/{id}", Method.DELETE); 
			request.AddUrlSegment ("id", eventId.ToString()); 

			return Execute (request); 
		}

		public override bool addEventToUser(int userId, int eventId, JObject obj) 
		{
			var request = new RestRequest ("users/{uid}/events/{eid}", Method.PUT); 
			request.AddUrlSegment ("uid", userId.ToString ()); 
			request.AddUrlSegment ("eid", eventId.ToString ()); 

			return Execute (request); 
			
		}

		public override bool deleteEventOnUser(int userId, int eventId) 
		{
			var request = new RestRequest ("users/{uid}/events/{eid}", Method.DELETE); 
			request.AddUrlSegment ("uid", userId.ToString ()); 
			request.AddUrlSegment ("eid", eventId.ToString ()); 

			return Execute (request); 
		}

	}
}

