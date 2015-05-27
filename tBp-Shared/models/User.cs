using System;

namespace tBpShared
{
	public abstract class User 
	{

		public int? UID { get; private set; }
		public string LastName { get; private set; } 
		public string FirstName { get; private set; }
		public byte[] BarcodeHash { get; private set; }

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