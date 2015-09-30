using System.Collections.Generic; 

namespace tBpShared
{
	public interface IEntityDatabase
	{
		List<User> getUsers(); 
		List<Event> getEvents(); 
		List<Event> getEventsForUser(int userId); 
		List<User> getUsersForEvent(int eventId); 

		User getUser(int userId); 
		Event getEvent(int eventId); 

		int saveUser(User user); 
		int saveEvent(Event e); 
	}
}

