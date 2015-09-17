using System;
using System.Linq;
using Android.App;
using Android.Content;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;
using Android.Support.V7.Widget;
using System.Collections.Generic;

using Newtonsoft.Json; 

using tBpShared;

namespace tBpAndroid
{
	[Activity (Label = "Events on the Horizon")]
	//TODO: Fragments
	public class EventListActivity : Activity
	{
		RecyclerView mRecyclerView;
		RecyclerView.LayoutManager mLayoutManager;
		EventListAdapter mAdapter;
		List<Event> mEventList;

		private List<Event> getEvents() {
			//TODO: Use DB. These are temporary values
			var recentEvents = new List<Event> {
				new TBPEvent(id: null, name: "STUPIDLY LONG ASS TBP EVENT NAME", date: new DateTime(1994, 03, 01), 
					type:TBPEvent.Category.Community, points: 20, officer:"ATonyGuy"),
				new TBPEvent(id: null, name: "Event2", date: new DateTime(2000, 04, 01), 
					type:TBPEvent.Category.Wildcard, points: 20, officer:"Juby"),
				new TBPEvent(id: null, name: "Event3", date: new DateTime(2015, 05, 01), 
					type:TBPEvent.Category.Academic, points: 20, officer:"BeardedOne"),
				new TBPEvent(id: null, name: "Event3", date: new DateTime(2016, 06, 01), 
					type:TBPEvent.Category.Social, points: 20, officer:"aAron"),
				new TBPEvent(id: null, name: "Event3", date: new DateTime(2016, 07, 01), 
					type:TBPEvent.Category.Community, points: 20, officer:"aAron"),
				new TBPEvent(id: null, name: "Event3", date: new DateTime(2016, 08, 01), 
					type:TBPEvent.Category.Social, points: 20, officer:"aAron"),
				new TBPEvent(id: null, name: "Event3", date: new DateTime(2016, 09, 30), 
					type:TBPEvent.Category.Community, points: 20, officer:"aAron"),
			}; 
			return recentEvents;
		}

		protected override void OnCreate (Bundle bundle)
		{
			base.OnCreate (bundle);

			// Instantiate the events
			mEventList = getEvents(); 

			// Set our view from the "EventList" layout resource:
			SetContentView (Resource.Layout.EventList);
			mRecyclerView = FindViewById<RecyclerView> (Resource.Id.recyclerView);
			mLayoutManager = new LinearLayoutManager (this);
			mRecyclerView.SetLayoutManager (mLayoutManager);

			// Initialize the adapter
			mAdapter = new EventListAdapter (this, mEventList);
			mRecyclerView.SetAdapter (mAdapter);


			// Manage Button
			Button temporaryButton = FindViewById<Button> (Resource.Id.placeholderButton); 
			temporaryButton.Click += (object sender, EventArgs e) => 
				Toast.MakeText(this, "Clicked temporary button", ToastLength.Short).Show(); 
			temporaryButton.Visibility = ViewStates.Gone;
		}

	}

	public class EventViewHolder : RecyclerView.ViewHolder
	{

		public TextView CaptionName { get; private set; }
		public TextView CaptionDate { get; private set; }
		public TextView CaptionType { get; private set; }
		public LinearLayout ExtraLayout { get; private set; }

		// Get references to the views defined in the CardView layout.
		public EventViewHolder (View itemView, Action<View, int> onClick, Action<View, int> onLongClick)
			: base (itemView)
		{
			ExtraLayout = itemView.FindViewById<LinearLayout> (Resource.Id.extraCardView); 
			CaptionType = itemView.FindViewById<TextView> (Resource.Id.eventCardType); 
			CaptionName = itemView.FindViewById<TextView> (Resource.Id.eventCardName); 
			CaptionDate = itemView.FindViewById<TextView> (Resource.Id.eventCardDate); 
			itemView.Click += (sender, e) => onClick (itemView, base.AdapterPosition); 
			itemView.LongClick += (sender, e) => onLongClick (itemView, base.AdapterPosition); 
		}

	}

	public class EventListAdapter : RecyclerView.Adapter
	{
		public List<Event> mEventList;
		public List<bool> mExpandView; // Also really ugly

		public Context mAdapterContext; 

		public EventListAdapter (Context c, List<Event> events)
		{
			events.Sort ((a, b) => b.Date.CompareTo (a.Date)); 
			mEventList = events; 

			mExpandView = new List<bool> (); 
			foreach (var v in events) {
				mExpandView.Add (false);
			}

			mAdapterContext = c;
		}

		public override RecyclerView.ViewHolder 
		OnCreateViewHolder (ViewGroup parent, int viewType)
		{
			View itemView = LayoutInflater.From (parent.Context).
				Inflate (Resource.Layout.EventCardView, parent, false);

			EventViewHolder vh = new EventViewHolder (itemView, OnClick, OnLongClick); 
			return vh;
		}

		public override void 
		OnBindViewHolder (RecyclerView.ViewHolder holder, int position)
		{
			EventViewHolder vh = holder as EventViewHolder;
			vh.CaptionName.Text = mEventList [position].Name;
			vh.CaptionDate.Text = mEventList [position].Date.ToString("M"); // Month Day Formatting
			vh.ExtraLayout.Visibility = mExpandView[position] ? ViewStates.Visible : ViewStates.Gone; 

			// TODO: Temporary and ugly
			if (mEventList[position] is TBPEvent) {
				TBPEvent e = mEventList [position] as TBPEvent; 
				vh.CaptionType.Text = e.EventType.ToString (); 
				switch (e.EventType) {
				case TBPEvent.Category.Academic: 
					vh.CaptionType.Text = "A";
					vh.CaptionType.SetBackgroundResource (Resource.Drawable.circle_academic); 
					break; 
				case TBPEvent.Category.Community: 
					vh.CaptionType.Text = "C";
					vh.CaptionType.SetBackgroundResource (Resource.Drawable.circle_community); 
					break; 
				case TBPEvent.Category.Social: 
					vh.CaptionType.Text = "S";
					vh.CaptionType.SetBackgroundResource (Resource.Drawable.circle_social); 
					break; 
				case TBPEvent.Category.Wildcard: 
					vh.CaptionType.Text = "W";
					vh.CaptionType.SetBackgroundResource (Resource.Drawable.circle_wildcard); 
					break; 
				default: 
					break; 
				}
			}
		}

		public override int ItemCount {
			get { return mEventList.Count; }
		}

		void OnClick(View v, int position) {
			mEventList [position].Name = "Clicked"; 
			NotifyItemChanged (position); 

			var activity = new Intent (mAdapterContext, typeof(IndividualEventActivity));
			JsonSerializerSettings settings = new JsonSerializerSettings 
			{ 
				TypeNameHandling = TypeNameHandling.All
			}; 
			activity.PutExtra("event", JsonConvert.SerializeObject(mEventList[position], settings)); 
			mAdapterContext.StartActivity (activity);
		}

		void OnLongClick(View v, int position) {
			mEventList [position].Name = "Long Clicked"; 
			mExpandView [position] = !mExpandView[position]; 
			NotifyItemChanged (position); 
		}

	}
}
