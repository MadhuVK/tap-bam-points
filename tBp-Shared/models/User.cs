using System;

namespace tBpShared
{
	public abstract class User 
	{

		public int? UID { get; set; }
		public string LastName { get; set; } 
		public string FirstName { get; set; }
		public byte[] BarcodeHash { get; set; }

		protected User() {}
		protected User(int? uid, string fname, string lname, string barcode)
		{
			UID = uid;
			FirstName = fname; 
			LastName = lname; 
			BarcodeHash = Crypto.Hash (barcode);
		}

		protected User(int? uid, string fname, string lname, byte[] barcodeHash)
		{
			UID = uid;
			FirstName = fname; 
			LastName = lname; 
			BarcodeHash = barcodeHash; 
		}

		public abstract int? save (); 
		public abstract override string ToString ();

	}
}