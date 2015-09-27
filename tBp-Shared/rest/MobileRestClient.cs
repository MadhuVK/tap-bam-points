using System;

using Newtonsoft.Json; 
using RestSharp;
using RestSharp.Extensions;
using RestSharp.Deserializers;

using System.Collections; 


namespace tBpShared
{
	public class MobileRestClient : RestClient
	{
		IDeserializer JsonHandler { get; set; }
		public MobileRestClient (String url) : base (url)
		{
			JsonHandler = new MobileDeserializer (); 
		}

		public IRestResponse<T> ExecuteAbstract<T>(IRestRequest request) 
		{
			return Deserialize<T>(request, Execute (request)); 
		}

		IRestResponse<T> Deserialize<T>(IRestRequest request, IRestResponse raw) 
		{
			request.OnBeforeDeserialization(raw);

			IRestResponse<T> response = new RestResponse<T>();

			try
			{
				response = raw.ToAsyncResponse<T>();
				response.Request = request;

				// Only attempt to deserialize if the request has not errored due
				// to a transport or framework exception.  HTTP errors should attempt to 
				// be deserialized 
				if (response.ErrorException == null)
				{

					// Only handles Json for now since RestSharp is being dumb
					IDeserializer handler = null; 
					if (raw.ContentType.Equals("application/json")) {
						handler = JsonHandler; 
					}

					// Only continue if there is a handler defined else there is no way to deserialize the data.
					// This can happen when a request returns for example a 404 page instead of the requested JSON/XML resource
					if (handler != null)
					{
						handler.RootElement = request.RootElement;
						handler.DateFormat = request.DateFormat;
						handler.Namespace = request.XmlNamespace;

						response.Data = handler.Deserialize<T>(raw);
					}
				}
			}
			catch (Exception ex)
			{
				response.ResponseStatus = ResponseStatus.Error;
				response.ErrorMessage = ex.Message;
				response.ErrorException = ex;
			}

			return response;
		}

		class MobileDeserializer : IDeserializer
		{
			public T Deserialize<T> (IRestResponse response)
			{
				if (typeof(T) is IEnumerable) {
					return JsonConvert.DeserializeObject<T> (response.Content, new ListJsonConverter<T> ()); 
				} else {
					return JsonConvert.DeserializeObject<T> (response.Content, new SingleJsonConverter<T> ()); 
				}
			}

			public string RootElement { get; set; }
			public string Namespace { get; set; }
			public string DateFormat { get; set; }
		}
	}
}

