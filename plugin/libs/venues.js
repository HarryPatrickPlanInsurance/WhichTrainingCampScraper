function Venues(){
	
	var URL_VENUES = 'http://www.whichtrainingcamp.com/sports/';
	
	const DELAY_VENUES=2000;
	const DELAY_VENUE=200;
	var self = this;
	var Venue = new (function(){
		var construct = function(url, html){
		var self = this;
		var outer = document.createElement('div');
		outer.innerHTML = html;
		var mainContentTabberTab = getMainContentTabberTab(outer);
		var spans = mainContentTabberTab.getElementsByTagName('span');
		self.name = getName(spans);
		self.location = getLocation(spans);
		self.phone = getPhone(spans);
		self.sports = getSports(spans).join(',');
		self.website = getWebsite(mainContentTabberTab);
		self.twitters = joinWithTitles(getTwitters(mainContentTabberTab));
		self.facebooks = joinWithTitles(getFacebooks(mainContentTabberTab));
		self.whichUrl = url;
		self.latLng = getLatLang(mainContentTabberTab);
		self.youtubes = joinWithTitles(getYoutubeVideos(outer));
		console.log(self);
	};
	return construct;
	function getMainContentTabberTab(outer){
		var mainContentTabberTabs = outer.getElementsByClassName('main-content-tabbertab');
		for(var i=0, mainContentTabberTab; mainContentTabberTab=mainContentTabberTabs[i]; i++){
			var foundIt = false;
			var h3s = mainContentTabberTab.getElementsByTagName('h3');
			for(var j=0, h3; h3 = h3s[j]; j++){
				if(h3.innerHTML.indexOf('Venue Details')>=0)
					return mainContentTabberTab;
			}
		}
	}
	function getName(spans){
		return getFromSpanPair('Name:', spans);	
	}
	function getLocation(spans){
		return getFromSpanPair('Location:', spans);	
	}
	function getPhone(spans){
		return getFromSpanPair('Phone:', spans);
	}
	function getSports(spans){
		var sports = getFromSpanPair('Sports:', spans);	
		return sports.split(',');
	}
	function getFromSpanPair(firstSpanSubstring, spans){
		for(var i=0, span; span=spans[i]; i++){
			if(span.innerText.indexOf(firstSpanSubstring)>=0)
			{
				return span.nextSibling.innerText;
			}
		}	
	}
	function getWebsite(outer){
		var regExp = new RegExp('<a target="_blank" class="externallink" href="(.+?)">');
		var m;
		if (m = regExp.exec(outer.innerHTML)) {
		return m[1];
		}
	}
	function getTwitters(outer){
		var html = outer.innerHTML;
		var regExp = new RegExp('class="externallink" href="((?:https|http)://(?:www|)twitter\.com.+?)" target="','g');
		var m;
		var list = [];
		while(m = regExp.exec(html)) {
			var url = m[1];
			var startPosition = m.index+url.length;
			var substr = html.substr(startPosition, html.length-startPosition);
			var regExpTitle = new RegExp('">([^<>]+?)</a','g');
			var title = regExpTitle?regExpTitle.exec(substr)[1]:'';
			list.push({url:url, title:title});
		}
		return list;
	}
	function getLatLang(outer){
		var html = outer.innerHTML;
		var regExp = /new google\.maps\.LatLng\(([0-9\.-]+),([0-9\.-]+)\),/g;
		var res = regExp.exec(html);
		if(res){
			var lat = res[1];
			var lng = res[2];
			return {lat:lat, lng:lng};
		}
	}
	function getFacebooks(outer){
		var html = outer.innerHTML;
		var regExp = new RegExp('class="externallink" href="((?:https|http)://(?:www).facebook\.com.+?)" target="','g');
		var m;
		var list = [];
		while(m = regExp.exec(html)) {
			var url = m[1];
			var startPosition = m.index+url.length;
			var substr = html.substr(startPosition, html.length-startPosition);
			var regExpTitle = new RegExp('">([^<>]+?)</a','g');
			var title = regExpTitle?regExpTitle.exec(substr)[1]:'';
			list.push({url:url, title:title});
		}
		return list;
	}
	function getYoutubeVideos(outer){
		var regExp = new RegExp('(https://www\.youtube(:?-nocookie|)\.com.+)');
		var list = [];
		var summaryboxs = outer.getElementsByClassName('summarybox');
		for(var j=0,summarybox ; summarybox =summaryboxs[j];j++){
			var iframes = summarybox .getElementsByTagName('iframe');
			for(var i=0, iframe; iframe=iframes[i]; i++){
				var res = regExp.exec(iframe.src);
				if(res){
					var url = res[1];
					var summaryTitles = summarybox.getElementsByClassName('summarytitle');
					var title;
					if(summaryTitles.length>0)
					{
						var summaryTitle = summaryTitles[0];
						title = summaryTitle.innerText;
					}
					list.push({url:url, title:title});
				}
			}
		}
		return list;
	}
	function joinWithTitles(arr){
		var str='';
		var first = true;
		for(var i=0,item; item=arr[i]; ++i){
			if(first)first=false; else str+='';
			str+=/*item.title+': '+*/
			item.url;
			break;
		}
		return str;
	}
	})();
	this.getVenue=function(url, callback){
			ajax(url, {}, function(result){
				callback({successful:true, venue:new Venue(url, result)});
				}, 
				function(error){
					callback({successful: false, error:error}
					);
		});
	};
	
	this.getVenues=function(sportNames, callbackGotVenue, callbackDone){
		var venueUrls = new VenueUrls();
		new (function(callbackGotVenue, callbackDone){
			var callAfterDelayVenue;
			var stopped=false;
			var scrapedAllVenueUrls = false;
			var nPages;
			var nPage=1;
					var url = URL_VENUES+sportNames.next();
				var callAfterDelayVenues = new CallAfterDelay(
				function(){
					console.log('Getting venues from: '+url);
					ajax(url, {},
					function(result){
						if(nPages==undefined){
							nPages=getNPagesForSport(result);
							console.log(nPages);
						}
						var listVenueUrls = getVenueUrlsFromHtml(result);
						if(nPage>=nPages)
						{
							if(!sportNames.hasNext()){
								console.log('finished scraping venues '+url);
								scrapedAllVenueUrls=true;
							}
							else{
								console.log('a');
								url = URL_VENUES+sportNames.next();
								nPages=undefined;
								nPage=1;
							}
						}
						else{
							console.log('b');
							nPage++;
							url = URL_VENUES+sportNames.next40();
						}
						venueUrls.addNew(listVenueUrls);
						if(!scrapedAllVenueUrls)
						{
							callAfterDelayVenues();
						}
						if(stopped)
						{
							stopped=false;
							callAfterDelayVenue();
						}
						else{
							callAfterDelayVenue();
						}
					}, function(error){
						console.log(error);
						console.log('trying to get page '+url+' again');
						callAfterDelayVenues();
					});
				}, DELAY_VENUES);
			callAfterDelayVenue = new CallAfterDelay(
			function(){
				if(venueUrls.hasNext()){
					var venueUrl = venueUrls.next();
					self.getVenue(venueUrl, 
					function(result){
						if(result.successful){
						venueUrls.remove(venueUrl);
							callbackGotVenue(result.venue);
							callAfterDelayVenue();
						}
						else{
							console.log(error);
							console.log('trying to get venue '+venueUrl+' again');
							callAfterDelayVenue();
						}
					});
				}
				else{
					stopped=true;
					if(scrapedAllVenueUrls){
						callbackDone();
					}
				}
			}, DELAY_VENUE);
		})(callbackGotVenue, callbackDone);
	};
	function getVenueUrlsFromHtml(html){
		//<a class="title-link" href="/sports/triathlon-cycling-camp/masters-of-tri-spain">Masters of Tri </a>
		var regExp = new RegExp("<a class=\"title-link\" href=\"([/a-zA-Z_-]+)\">", "g");
		var m;
		var list = [];
		while (m = regExp.exec(html)) {
		list.push(m[1]);
		console.log(m[1]);
		}
		return list;
	}
	function getNPagesForSport(html){
		var outer = document.createElement('div');
		outer.innerHTML=html;
		var paginationEnds = outer.getElementsByClassName('pagination-end');
		if(paginationEnds.length>0){
			console.log('found pagenation endes');
			var paginationEnd = paginationEnds[0];
			var url = paginationEnd.getElementsByTagName('a')[0].href;
			var regExp = new RegExp('start=([0-9]+)');
			var res = regExp.exec(url);
			if(res){
				return (parseInt(res[1])/40)+1;
			}
		}
		return 1;
	}
	function ajax(url, params, callbackSuccessful, callbackError)
	{
		url +='?';
		var first=true;
	    for(var i in params){
			if(first)first=false; else url+="&";
			url+=i+'=';
			var value = params[i];
			if(value!=undefined)
				url+=String(value);
		}
		$.ajax({
			type: "GET",
			url:url,
			success: function (resultData) {
				callbackSuccessful(resultData);
			},
			error:function(error){
				callbackError(error);
			}
		});
	}
	function VenueUrls(){
		var self = this;
		var list =[];
		var history = [];
		this.addNew = function(venueUrls){
			for(var i=0,venueUrl;venueUrl=venueUrls[i];i++){
				if(history.indexOf(venueUrl)<0){
					list.push(venueUrl);
					history.push(venueUrl);
				}
			}
			console.log("list length is: "+list.length);
		};
		this.next=function(){console.log(list[0]);return list[0];};
		this.hasNext=function(){
			return list.length>0;
		};
		this.remove=function(venueUrl){var ret =  list.splice(list.indexOf(venueUrl), 1)[0];
			return ret;
		};
	}
}