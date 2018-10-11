function SportsNames(array){
	var self = this;
    var index=0;
	var count40=1;
    var length=array.length;
	var current;
    this.next=function()
    {
        current=array[index];
		console.log(array);
		console.log(current);
        index++;
		count40=1;
        return current;
    };
	this.next40=function(){
		return current+'?start='+String(count40++*40);
	};
    this.hasNext=function()
    {
      return index<length;
    };
}