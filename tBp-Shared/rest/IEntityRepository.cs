/* This file is used to interact with the 
 * server database store. 
 */
using System.Collections.Generic;
using System; 


namespace tBpShared
{
	public interface IEntityRepository
	{

		void AssignClient(Uri baseUrl, string auth_token); 

		List<User> getUsers();

		List<Event> getEvents(); 

		List<Event> getEventsForUser(int userId); 

		List<User> getUsersForEvent(int eventId);

		User getUser(int userId); 

		Event getEvent(int eventId); 

		bool addUser(User user); 

		bool addEvent(Event e); 

		bool deleteUser(int userId); 

		bool deleteEvent(int eventId); 

		bool addEventToUser(int userId, int eventId); 

		bool deleteEventOnUser(int userId, int eventId); 

		bool updateEventOnUser(int userId, int eventId); 

		bool updateUser(int userId); 

		bool updateEvent(int eventId); 
	}
}

