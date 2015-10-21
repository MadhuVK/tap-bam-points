
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
		bool inProg; 


		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);
			inProg = false;
			MobileBarcodeScanner.Initialize (Application);
			scanner = new MobileBarcodeScanner ();
			SetContentView (Resource.Layout.ScanEvent);
	
			Button scan = FindViewById<Button> (Resource.Id.buttonScan);
			scan.Click += async delegate {
				inProg = true;
				var result = await scanner.Scan();
				HandleScanResult(result);
			};


		}

		protected override void OnResume ()
		{
			base.OnResume ();
			if(inProg)	
				doScan ();
		}

		async void doScan()
		{
			var result = await scanner.Scan ();
			HandleScanResult (result);
		}


		void HandleScanResult(ZXing.Result result)
		{
			if (result != null && !string.IsNullOrEmpty (result.Text)) {
				var database = EntityDatabase.get ();
				User u = (TBPUser)database.getUserByBarcode (result.Text);
				if (u == null) {
					this.RunOnUiThread (() => Toast.MakeText (this, "Not a valid Barcode", ToastLength.Short).Show ());
					return;
				}
				var mSignInAct = new Intent (this, typeof(MemberSignInActivity));
				var settings = new JsonSerializerSettings { 
					TypeNameHandling = TypeNameHandling.All
				}; 
				mSignInAct.PutExtra ("event", Intent.GetStringExtra ("event"));
				mSignInAct.PutExtra ("user", JsonConvert.SerializeObject (u, settings));
				//StartActivity (mSignInAct);
				StartActivityForResult (mSignInAct, 0);
			} else {
				this.RunOnUiThread (() => Toast.MakeText (this, "Scanning Cancelled", ToastLength.Short).Show ());
				inProg = false;
			}
		}

		protected override void OnActivityResult (int requestCode, Android.App.Result resultCode, Intent data)
		{

			base.OnActivityResult (requestCode, resultCode, data);
			if (requestCode == 0) {
				if (resultCode == Android.App.Result.Ok) {
					var names = FindViewById<TextView> (Resource.Id.scanEventNames);
					names.Append(data.GetStringExtra("userName") + "\n");
				}
			}
					
		}
			

	
		
	}


}

