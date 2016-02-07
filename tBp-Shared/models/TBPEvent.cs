using System;
using Newtonsoft.Json;
using RestSharp.Deserializers; 

namespace tBpShared
{
	public sealed class TBPEvent : Event
	{

		public enum Category { Academic, Social, Community };

		public Category Type { get; set; }
		public int Points { get; set; }
		public string Officer { get; set; }
		public bool Wildcard { get; set; }


		public TBPEvent() {}
		public TBPEvent(int? id, string name, DateTime? date, 
			Category type, int points, string officer) : base(id, name, date)
		{
			Type = type; 
			Points = points; 
			Officer = officer; 
		}

		public override int? save() 
		{
			// TODO: Database Call 
			return null;
		}

		public override string ToString ()
		{
 			return JsonConvert.SerializeObject (this); 
		}


	}
}

