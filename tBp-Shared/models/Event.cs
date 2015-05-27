using System;

namespace tBpShared
{
	public abstract class Event
	{
		public int? EID { get; protected set; } 
		public string Name { get; protected set; }
		public DateTime Date { get; protected set; }

		protected Event(int? id, string name, DateTime? date)
		{
			EID = id; 
			Name = name; 
			Date = date ?? DateTime.Today;
		}

		public abstract int? save (); 
		public abstract override string ToString(); 

	}
}

