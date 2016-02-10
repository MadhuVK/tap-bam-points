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

			var scanActivity = new Intent (this, typeof(ScanEventActivity));
			scanActivity.PutExtra ("event", jsonEvent);

			ScanButton.Click += (sender, e) => StartActivity (scanActivity);
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

