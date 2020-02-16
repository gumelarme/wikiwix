let table = document.getElementById("tableBody");
let btnSave = document.getElementById("btnSave");
let btnAdd = document.getElementById("btnAdd");

function loadRules(rules){
	let host = document.getElementById("host");
	host.setAttribute('value', rules.host);
	console.log(rules)
	Object.keys(rules.wikis).forEach(function(key, index){
		const wiki = rules.wikis[key];
		const div = document.getElementsByClassName("wiki")[0];
		const newDiv = div.cloneNode(true)
		newDiv.removeAttribute("hidden");
		getFirstElement(newDiv,"offlineWiki").setAttribute('value', wiki.offlineWiki);
		getFirstElement(newDiv, "target").setAttribute('value', wiki.target);
		getFirstElement(newDiv, "matcher").setAttribute('value', wiki.matcher);
		table.appendChild(newDiv);
	})
}

function getFirstElement(node, className){
	return node.getElementsByClassName(className)[0]
}

btnSave.addEventListener('click', function(){
	let rules = {}
	rules.host = document.getElementById('host').value;
	rules.wikis = {}

	// remove hidden row
	let wikis = Array.from(document.getElementsByClassName('wiki'))
		.filter(x => !x.hasAttribute('hidden'))

	
	wikis.forEach(function(node, index){
		rules.wikis[`open_kiwix_${index}`] = {
			offlineWiki: getFirstElement(node, 'offlineWiki').value,
			matcher: getFirstElement(node, 'matcher').value,
			target: getFirstElement(node, 'target').value,
		}
	});

	chrome.storage.sync.set({'config':rules}, function(){
		alert("Saved successfully");
	})
})

btnAdd.addEventListener('click', function(){
	// Clone the hidden wiki row
	const hiddenRow = document.getElementsByClassName('wiki')[0].cloneNode(true);
	hiddenRow.removeAttribute('hidden');
	table.appendChild(hiddenRow);

})

function init(){
	chrome.storage.sync.get('config', function(config){
		loadRules(config.config);
	})
}
init();
