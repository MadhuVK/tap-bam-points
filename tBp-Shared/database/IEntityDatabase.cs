using System; 
using System.Linq;
using System.Collections.Generic; 

namespace tBpShared
{
	public interface IEntityDatabase
	{
		List<User> getUsers(); 

		/** Example Usage: 
		 * getUsers(user => user.BarcodeHash.equals(myHash))
		*/ 
		List<User> getUsers (Func<User, bool> condition); 
			
		List<Event> getEvents(); 

		/** Example Usage: 
		 * getEvents(event => event.Name.equals(myName))
		*/ 
		List<Event> getEvents (Func<Event, bool> condition); 
		List<Event> getEventsForUser(int userId); 
		List<User> getUsersForEvent(int eventId); 

		User getUser(int userId); 
		User getUserByBarcode (string barcode);
		Event getEvent(int eventId); 

		int saveUser(User user); 
		int saveEvent(Event e); 
	}
}

