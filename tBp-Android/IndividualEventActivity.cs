using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.Support.V7.Widget;
using Newtonsoft.Json;
using ZXing;
using ZXing.Mobile;

using tBpShared;

namespace tBpAndroid
{
	[Activity (Label = "Individual Event Activity")]			
	public class IndividualEventActivity : Activity
	{
		Event Event { get; set; }
		List<User> Users { get; set; }
		TextView NameField { get; set; }
		TextView DateField { get; set; }
		Button ScanButton { get; set; }

		RecyclerView mRecyclerView;
		RecyclerView.LayoutManager mLayoutManager;
		UserListAdapter mAdapter;

		MobileBarcodeScanner scanner;
		MobileBarcodeScanningOptions scanOptions;
		bool continueScan; 

		const int SIGN_IN_REQUEST = 0;
		const int CREATE_MEMBER_REQUEST = 1;


		Event GetEvent (string jsonEvent)
		{
			
			JsonSerializerSettings settings = new JsonSerializerSettings {
				TypeNameHandling = TypeNameHandling.All
			};
			return JsonConvert.DeserializeObject<Event> (jsonEvent, settings); 
		}

		void SetUIElementsForAccess ()
		{
			NameField = FindViewById<TextView> (Resource.Id.CardName); 
			DateField = FindViewById<TextView> (Resource.Id.CardDate); 
			ScanButton = FindViewById<Button> (Resource.Id.eventCardScan); 
		}

		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);

			var jsonEvent = Intent.GetStringExtra ("event"); 

			Event = GetEvent (jsonEvent); 
			if (Event.Id == null) {
				throw new Exception ("Invalid event id on load"); 
			} else {
				Users = EntityRepository.get ().getUsersForEvent (Event.Id.GetValueOrDefault ()); 
			}

			SetContentView (Resource.Layout.IndividualEventCardView); 
			mRecyclerView = FindViewById<RecyclerView> (Resource.Id.recyclerViewUsers); 
			mLayoutManager = new LinearLayoutManager (this); 
			mRecyclerView.SetLayoutManager (mLayoutManager); 
			SetUIElementsForAccess (); 

			mAdapter = new UserListAdapter (this, Users); 
			mRecyclerView.SetAdapter (mAdapter); 

			NameField.Text = Event.Name; 
			DateField.Text = Event.DateTime.ToString ("M"); 

			continueScan = false;
			MobileBarcodeScanner.Initialize (Application);
			scanner = new MobileBarcodeScanner ();
			scanOptions = new MobileBarcodeScanningOptions ();
			scanOptions.PossibleFormats = new List<ZXing.BarcodeFormat> () {
				ZXing.BarcodeFormat.CODABAR
			};


			ScanButton.Click += async delegate {
				continueScan = false;
				var result = await scanner.Scan(scanOptions);
				HandleScanResult(result);
			};
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
			var result = await scanner.Scan (scanOptions);
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
				if (!DidUserAttendEvent(u)){
					this.RunOnUiThread (() => Toast.MakeText (this, "User already signed in", ToastLength.Short).Show ());
					return;
				}
				signInUser (u);
				continueScan = true;
			} else {
				this.RunOnUiThread (() => Toast.MakeText (this, "Scanning Cancelled", ToastLength.Short).Show ());
				continueScan = false;
			}
		}

		bool DidUserAttendEvent(User user) {
			var result = from u in Users
					where u.BarcodeHash.Equals(user.BarcodeHash)
			             select u;
			return result != null;
							
		}

		void signInUser(User u) 
		{
			var mSignInAct = new Intent (this, typeof(MemberSignInActivity));
			mSignInAct.PutExtra ("event", Intent.GetStringExtra ("event"));
			JsonSerializerSettings settings = new JsonSerializerSettings { 
				TypeNameHandling = TypeNameHandling.All
			}; 
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
					TBPUser user = JsonConvert.DeserializeObject<TBPUser> (data.GetStringExtra ("user"));
					Users.Add (user);
					mAdapter.NotifyDataSetChanged ();

				} else {
					this.RunOnUiThread (() => Toast.MakeText (this, "User Not Signed In", ToastLength.Short).Show ());
				}
				break;
			case CREATE_MEMBER_REQUEST:
				if (resultCode == Android.App.Result.Ok) {
					string user_string = data.GetStringExtra ("user");
					TBPUser user = JsonConvert.DeserializeObject<TBPUser> (user_string);
					this.RunOnUiThread (() => Toast.MakeText (this, "New User Created", ToastLength.Short).Show ());
					signInUser (user);
					continueScan = true;
				} else {
					this.RunOnUiThread (() => Toast.MakeText (this, "User Not Created", ToastLength.Short).Show ());
				}
				break;
			}


		}

	}



	public class UserViewHolder : RecyclerView.ViewHolder
	{

		public TextView CaptionName { get; private set; }
		public TextView CaptionType { get; private set; }

		// Get references to the views defined in the CardView layout.
		public UserViewHolder (View itemView)
			: base (itemView)
		{
			CaptionName = itemView.FindViewById<TextView> (Resource.Id.userCardName); 
			CaptionType = itemView.FindViewById<TextView> (Resource.Id.userCardType); 
		}

	}

	public class UserListAdapter : RecyclerView.Adapter
	{
		public List<User> mUserList;
		public Context mAdapterContext;

		public UserListAdapter (Context c, List<User> users)
		{
			users.Sort ((a, b) => (a.LastName + a.FirstName).CompareTo (b.LastName + b.FirstName));
			mUserList = users; 
			mAdapterContext = c;
		}

		public override RecyclerView.ViewHolder 
		OnCreateViewHolder (ViewGroup parent, int viewType)
		{
			View itemView = LayoutInflater.From (parent.Context).
				Inflate (Resource.Layout.UserCardView, parent, false);

			var vh = new UserViewHolder (itemView); 
			return vh;
		}

		public override void 
		OnBindViewHolder (RecyclerView.ViewHolder holder, int position)
		{
			var vh = holder as UserViewHolder;
			var user = mUserList [position] as TBPUser; 
			vh.CaptionName.Text = String.Format ("{0} {1}", user.FirstName, user.LastName); 
			vh.CaptionType.Text = user.MemberStatus.ToString (); 

		}

		public override int ItemCount {
			get { return mUserList.Count; }
		}

	}
}

