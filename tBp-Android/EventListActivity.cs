﻿using System;
using Android.App;
using Android.Content;
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
		int mBackPressedCount; 

		protected override void OnCreate (Bundle savedInstanceState)
		{
			base.OnCreate (savedInstanceState);

			// Instantiate the events
			mEventList = EntityRepository.get().getEvents(); 

			// Set our view from the "EventList" layout resource:
			SetContentView (Resource.Layout.EventList);
			mRecyclerView = FindViewById<RecyclerView> (Resource.Id.recyclerViewEvents);
			mLayoutManager = new LinearLayoutManager (this);
			mRecyclerView.SetLayoutManager (mLayoutManager);

			// Initialize the adapter
			mAdapter = new EventListAdapter (this, mEventList);
			mRecyclerView.SetAdapter (mAdapter);


			// Manage Button
			Button temporaryButton = FindViewById<Button> (Resource.Id.placeholderButton); 
			temporaryButton.Click += (sender, e) => 
				Toast.MakeText(this, "Clicked temporary button", ToastLength.Short).Show(); 
			temporaryButton.Visibility = ViewStates.Gone;
		}

		public override void OnBackPressed ()
		{
			if(mBackPressedCount >= 1)
			{
				Intent intent = new Intent(Intent.ActionMain);
				intent.AddCategory(Intent.CategoryHome);
				intent.SetFlags(ActivityFlags.NewTask);
				StartActivity(intent);
			}
			else
			{
				Toast.MakeText(this, 
					"Press the back button once again to close the application.", ToastLength.Short).Show();
				mBackPressedCount++;
			}
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
			itemView.Click += (sender, e) => onClick (itemView, AdapterPosition); 
			itemView.LongClick += (sender, e) => onLongClick (itemView, AdapterPosition); 
		}

	}

	public class EventListAdapter : RecyclerView.Adapter
	{
		public List<Event> mEventList;
		public List<bool> mExpandView; // Also really ugly

		public Context mAdapterContext; 

		public EventListAdapter (Context c, List<Event> events)
		{
			events.Sort ((a, b) => b.DateTime.CompareTo (a.DateTime)); 
			mEventList = events; 

			mExpandView = new List<bool> (); 
			events.ForEach (v => mExpandView.Add (false)); 

			mAdapterContext = c;
		}

		public override RecyclerView.ViewHolder 
		OnCreateViewHolder (ViewGroup parent, int viewType)
		{
			View itemView = LayoutInflater.From (parent.Context).
				Inflate (Resource.Layout.EventCardView, parent, false);

			var vh = new EventViewHolder (itemView, OnClick, OnLongClick); 
			return vh;
		}

		public override void 
		OnBindViewHolder (RecyclerView.ViewHolder holder, int position)
		{
			var vh = holder as EventViewHolder;
			vh.CaptionName.Text = mEventList [position].Name;
			vh.CaptionDate.Text = mEventList [position].DateTime.ToString("M"); // Month Day Formatting
			vh.ExtraLayout.Visibility = mExpandView[position] ? ViewStates.Visible : ViewStates.Gone; 

			// TODO: Temporary and ugly
			var e = mEventList[position] as TBPEvent; 
			if (e != null) {
				if (e.Wildcard) {
					vh.CaptionType.Text = "W";
					vh.CaptionType.SetBackgroundResource (Resource.Drawable.circle_wildcard); 
				} else {
					switch (e.Type) {
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
					}
				}
			}
		}

		public override int ItemCount {
			get { return mEventList.Count; }
		}

		void OnClick(View v, int position) {
			var activity = new Intent (mAdapterContext, typeof(IndividualEventActivity));
			var settings = new JsonSerializerSettings 
			{ 
				TypeNameHandling = TypeNameHandling.All
			}; 
			activity.PutExtra("event", JsonConvert.SerializeObject(mEventList[position], settings)); 
			mAdapterContext.StartActivity (activity);
		}

		void OnLongClick(View v, int position) {
			mExpandView [position] = !mExpandView[position]; 
			NotifyItemChanged (position); 
		}

	}
}
