using System;
using Newtonsoft.Json;

namespace tBpShared
{
	public class TBPUser : User
	{
		public enum Status { Member, Initiate, Officer };
		public enum HouseColor { Red, Green, Blue };

		public Status MemberStatus { get; set; }
		public HouseColor House { get; set; }

		public TBPUser() {}
		public TBPUser(int? uid, string fname, string lname, string barcode,
			Status status, HouseColor house) : base(uid, fname, lname, barcode)
		{
			MemberStatus = status; 
			House = house; 
		}

		public TBPUser(int? uid, string fname, string lname, byte[] barcodeHash,
			Status status, HouseColor house) : base(uid, fname, lname, barcodeHash)
		{
			MemberStatus = status; 
			House = house; 
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

