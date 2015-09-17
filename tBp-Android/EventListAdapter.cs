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

using tBpShared; 

namespace tBpAndroid
{
	public class EventListAdapter : BaseAdapter<Event> {

		Activity context;
		List<Event> events; 

		public EventListAdapter(Activity context, List<Event> events) : base() {
			this.context = context; 
			this.events = events; 
		}

		public override long GetItemId(int position)
		{
			return position;
		}

		public override Event this[int position] {  
			get { return events[position]; }
		}

		public override int Count {
			get { return events.Count (); }
		}

		public override View GetView(int position, View convertView, ViewGroup parent)
		{
			View view = convertView ?? context.LayoutInflater.Inflate(Android.Resource.Layout.SimpleListItem1, null); 

			view.FindViewById<TextView>(Android.Resource.Id.Text1).Text = events[position].ToString();
			return view;
		}
	}
}
