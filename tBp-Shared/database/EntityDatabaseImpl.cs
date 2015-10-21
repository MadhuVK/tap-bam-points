using System;
using System.Collections.Generic;

namespace tBpShared
{
	public class EntityDatabaseImpl : EntityDatabase
	{

		public new List<User> getUsers ()
		{
			return default(List<User>); 
		}

		public new List<Event> getEvents ()
		{
			return default(List<Event>); 
		}

		public new List<Event> getEventsForUser (int userId)
		{
			return default(List<Event>); 
		}

		public new List<User> getUsersForEvent (int eventId)
		{
			return default(List<User>); 
		}

		public new User getUser (int userId)
		{
			return default(TBPUser); 
		}

		public new User getUserByBarcode(string barcode)
		{
			return default(TBPUser);
		}

		public new Event getEvent (int eventId)
		{
			return default(TBPEvent); 
		}

		public new int saveUser (User user)
		{
			return default(int); 
		}

		public new int saveEvent (Event e)
		{
			return default(int); 
		}
	}
}

