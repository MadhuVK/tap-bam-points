/* This file is used to interact with the 
 * server database store. 
 */
using System.Collections.Generic;
using System; 

using Newtonsoft.Json.Linq; 


namespace tBpShared
{
	public interface IEntityRepository
	{

		void AssignClient(Uri baseUrl, string auth_token); 

		List<User> getUsers();
		List<User> getUsers (Func<User, bool> condition); 

		List<Event> getEvents(); 
		List<Event> getEvents (Func<Event, bool> condition); 

		List<Event> getEventsForUser(int userId); 
		List<User> getUsersForEvent(int eventId);

		User getUser(int userId); 
		Event getEvent(int eventId); 

		bool addUser(User user); 
		bool addEvent(Event e); 

		bool updateUser(int userId, JObject obj); 
		bool updateEvent(int eventId, JObject obj); 

		bool deleteUser(int userId); 
		bool deleteEvent(int eventId); 

		bool addEventToUser (int userId, int eventId, JObject obj); 
		bool updateEventOnUser(int userId, int eventId, JObject obj); 
		bool deleteEventOnUser(int userId, int eventId); 

	}
}

