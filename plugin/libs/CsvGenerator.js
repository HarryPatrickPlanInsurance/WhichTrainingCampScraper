function CsvGenerator(args){
	var columnDelimiter = args.columnDelimiter || ',';
    var lineDelimiter = args.lineDelimiter || '\n';
	var fileName = args.fileName;
	var mappings = args.mappings;
	var str = "data:text/csv;charset=utf-8,";
	var first=true;
	for(var title in mappings){
			if(first)first=false;else str+=columnDelimiter;
		str+=title;
	}
	str+=lineDelimiter;
	this.add=function(obj){
		var first=true;
		for(var title in mappings){
		if(first)first=false;else str+=columnDelimiter;
		var path = mappings[title];
		var value = getPropertybyString(obj, path);
		if(value==undefined)
			value='';
		str+=escapeValue(String(value));
		}
		str+= lineDelimiter;
	};
	function getPropertybyString(o, s) {
    s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = s.replace(/^\./, '');           // strip a leading dot
    var a = s.split('.');
    for (var i = 0, n = a.length; i < n; ++i) {
		if(o==undefined)return;
        var k = a[i];
        if (k in o) {
            o = o[k];
        } else {
            return;
        }
    }
    return o;
}
	this.download=function(){
		var data = encodeURI(str);
		console.log(fileName.substr(fileName.length-4, 4));
		if(fileName.length<=4||fileName.substr(fileName.length-4, 4)!='.csv')fileName+='.csv';
        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', fileName);
        link.click();
	}
	function escapeValue(value){
		value = replaceAll(value, '"','""');
		return '"'+value+'"';
	}
	function replaceAll(target, search, replacement) {
		console.log(typeof(target));
				return target.split(search).join(replacement);
	}
}