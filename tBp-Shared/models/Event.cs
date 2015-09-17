using System;

namespace tBpShared
{
	public abstract class Event
	{
		public int? EID { get; set; } 
		public string Name { get; set; }
		public DateTime Date { get; set; }

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

