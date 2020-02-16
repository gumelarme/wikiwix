
chrome.runtime.onInstalled.addListener(function(){
	let wikis = {}
	wikis['open_kiwix_0'] = {
		offlineWiki: "wikipedia_en_all_maxi_2018-10/A/${page}.html",
		target: "*://en.wikipedia.org/wiki/*",
		matcher: "(?<=wiki\/)[a-zA-Z0-9_]*"
	};

	wikis['open_kiwix_1'] = {
		offlineWiki: "stackoverflow_en_all_2018-10/A/${page}.html",
		target: "*://stackoverflow.com/questions/*",
		matcher: "(?<=questions\/)[a-zA-Z0-9_]*"
	};

	const rules = {
		host: "http://localhost:38981",
		wikis,
	}

	chrome.storage.sync.set({'config':rules}, function(){
		console.log("Rule stored");
	})
});

const createContext = function(id, target){
	chrome.contextMenus.create({
		id, 
		title: 'Open with kiwix',
		contexts: ["link"],
		visible: true,
		targetUrlPatterns: [target]
	});
}


chrome.storage.sync.get('config', function(config){
	let rules = config.config;

	Object.keys(rules.wikis).forEach(function(key, index){
		let wiki = rules.wikis[key];
		createContext(key, wiki.target);
	})
});



chrome.contextMenus.onClicked.addListener(function(item){
	const link = item.linkUrl;

	chrome.storage.sync.get('config', function(config){
		const rules = config.config;
		console.log(rules, link)
		const wiki = rules.wikis[item.menuItemId]
		if(wiki){
			const pattern = new RegExp(wiki.matcher);
			const page = pattern.exec(link)[0];
			const offline = wiki.offlineWiki.replace('${page}', page);
			chrome.tabs.create({
				url:`${rules.host}/${offline}`,
				active: true,
			});
		}
	});
});

