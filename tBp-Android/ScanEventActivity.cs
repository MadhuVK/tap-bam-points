﻿
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Newtonsoft.Json;
using ZXing;
using ZXing.Mobile;

using tBpShared;

namespace tBpAndroid
{
	[Activity (Label = "ScanEventActivity")]			
	public class ScanEventActivity : Activity
	{
		MobileBarcodeScanner scanner;
		bool continueScan; 
		JsonSerializerSettings settings;
		IEntityDatabase database;

		const int SIGN_IN_REQUEST = 0;
		const int CREATE_MEMBER_REQUEST = 1;

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			continueScan = false;
			MobileBarcodeScanner.Initialize (Application);
			scanner = new MobileBarcodeScanner ();
			SetContentView (Resource.Layout.ScanEvent);
			settings = new JsonSerializerSettings { 
				TypeNameHandling = TypeNameHandling.All
			}; 
			database = EntityDatabase.get ();
			Button scan = FindViewById<Button> (Resource.Id.buttonScan);
			scan.Click += async delegate {
				continueScan = false;
				var result = await scanner.Scan();
				HandleScanResult(result);
			};
			Button done = FindViewById<Button> (Resource.Id.buttonScanEventDone);

			done.Click += (sender, e) => Finish(); 

		}

		protected override void OnResume ()
		{
			base.OnResume ();
			if (continueScan) {
				doScan ();
			}
		}

		async void doScan()
		{
			continueScan = false;
			var result = await scanner.Scan ();
			HandleScanResult (result);
		}


		void HandleScanResult(ZXing.Result result)
		{
			if (result != null && !string.IsNullOrEmpty (result.Text)) {
				byte[] barcodeHash = Crypto.Hash (result.Text);
				string hexstring = BitConverter.ToString (barcodeHash).ToLower ().Replace ("-", "");
				List<User> lookupResults = EntityRepository.get ().getUsers (user => user.BarcodeHash == hexstring);
				User u = lookupResults.Count == 0 ? null :(TBPUser) lookupResults.ElementAt(0);
				if (u == null) {
					var cMemberAct = new Intent (this, typeof(CreateMemberActivity));
					cMemberAct.PutExtra ("barcode", result.Text);
					StartActivityForResult (cMemberAct, CREATE_MEMBER_REQUEST);
					return;
				}
				signInUser (u);
				continueScan = true;
			} else {
				this.RunOnUiThread (() => Toast.MakeText (this, "Scanning Cancelled", ToastLength.Short).Show ());
				continueScan = false;
			}
		}

		void signInUser(User u) 
		{
			var mSignInAct = new Intent (this, typeof(MemberSignInActivity));
			mSignInAct.PutExtra ("event", Intent.GetStringExtra ("event"));
			mSignInAct.PutExtra ("user", JsonConvert.SerializeObject (u, settings));
			StartActivityForResult (mSignInAct, SIGN_IN_REQUEST);
		}

		protected override void OnActivityResult (int requestCode, Android.App.Result resultCode, Intent data)
		{

			base.OnActivityResult (requestCode, resultCode, data);
			switch (requestCode) 
			{
			case SIGN_IN_REQUEST:
				if (resultCode == Android.App.Result.Ok) {
					var names = FindViewById<TextView> (Resource.Id.scanEventNames);
					names.Append (data.GetStringExtra ("userName") + "\n");
				} else {
					this.RunOnUiThread (() => Toast.MakeText (this, "User Not Signed In", ToastLength.Short).Show ());
				}
				break;
			case CREATE_MEMBER_REQUEST:
				if (resultCode == Android.App.Result.Ok) {
					string user_string = data.GetStringExtra ("user");
					TBPUser user = JsonConvert.DeserializeObject<TBPUser> (user_string);
					signInUser (user);
					this.RunOnUiThread (() => Toast.MakeText (this, "New User Created", ToastLength.Short).Show ());
				} else {
					this.RunOnUiThread (() => Toast.MakeText (this, "User Not Created", ToastLength.Short).Show ());
				}
				break;
			}

					
		}
			

	
		
	}


}

