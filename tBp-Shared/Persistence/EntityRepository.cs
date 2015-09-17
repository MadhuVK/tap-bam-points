using System;
using RestSharp; 

/* This file is used to interact with the 
 * server database store. Don't interact with 
 * this directly, will be called by a timer. 
 */
using System.Collections.Generic;

 
namespace tBpShared
{
	public class EntityRepository
	{
		const string BaseURL = "127.0.0.1/api";

		// Singleton 
		EntityRepository connection = new EntityRepository(); 

		IRestClient client; 

		EntityRepository ()
		{
			client = new RestClient (BaseURL); 
		}

		public EntityRepository get() {
			return connection;
		}

		public T Execute<T>(RestRequest request) where T : new()
		{
			var response = client.Execute<T> (request); 

			if (response.ErrorException != null) {
				const string message = "Error retrieving response. Check inner details for more info.";
				var exception = new ApplicationException (message, response.ErrorException); 
				throw exception;
			}
			return response.Data; 

		}

		public List<User> getUsers() 
		{ 
			var request = new RestRequest ("users", Method.GET); 
			return Execute<List<User>> (request); 
		}

		public List<Event> getEvents() 
		{ 
			var request = new RestRequest ("events", Method.GET); 
			return Execute<List<Event>> (request); 
		}

		public List<Event> getEventsForUser(int userId) 
		{ 
			var request = new RestRequest ("users/{id}/events", Method.GET); 
			request.AddUrlSegment("id", userId.ToString());

			return Execute<List<Event>> (request); 
		}
		public List<User> getUsersForEvent(int eventId) 
		{ 
			var request = new RestRequest ("events/{id}/users", Method.GET); 
			request.AddUrlSegment("id", eventId.ToString());

			return Execute<List<User>> (request); 
		}

		public User getUser(int userId) 
		{ 
			var request = new RestRequest ("users/{id}", Method.GET); 
			request.AddUrlSegment("id", userId.ToString());

			return null;
			//return Execute<User> (request); 
		}
		public Event getEvent(int eventId) 
		{ 
			var request = new RestRequest ("events/{id}", Method.GET); 
			request.AddUrlSegment ("id", eventId.ToString()); 

			return null; 
			//return this.Execute<Event> (request); 
		}

		public int addUser(User user) 
		{ 
			var request = new RestRequest ("users", Method.POST); 

			return Execute<int> (request); 
		}
		public int addEvent(Event e) 
		{ 
			var request = new RestRequest ("events", Method.POST); 

			return Execute<int> (request); 
		}

		public void deleteUser(int userId) {
			var request = new RestRequest ("users/{id}", Method.DELETE); 
			request.AddUrlSegment ("id", userId.ToString()); 

			//this.Execute<String> (request); 
			
		}
		public void deleteEvent(int eventId) 
		{
			var request = new RestRequest ("users/{id}", Method.DELETE); 
			request.AddUrlSegment ("id", eventId.ToString()); 

			//this.Execute<String> (request); 
			
		}

		/* These have aliases in the rest endpoints */
		public void addEventToUser(int userId, int eventId) {}
		public void deleteEventOnUser(int userId, int eventId) {}

		/* PATCH is not allowed in this revision */
		public void updateEventOnUser(int userId, int eventId) 
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}
		public void updateUser(int userId) 
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}
		public void updateEvent(int eventId) 
		{
			throw new NotImplementedException ("Updating not allowed in app."); 
		}

	}
}

