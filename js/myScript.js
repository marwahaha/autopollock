	var path;
	var splats;
	var new_size_influence;
	var mid_point_push;
	var max_line_width;
	var visible = true;

	var q = 0;
	var beginWait = true;
	var stopdraw = false;
	var killingcolorcycle = false;

	var start_x = 0;
	var start_y = 0;
	var mid_x = 0;
	var mid_y = 0;
	var end_x = 0;
	var end_y = 0;
	var parity = 0;
	var sizeM = 0;


	var new_size_influence;
	var mid_point_push;
	var max_line_width;
	new_size_influence = Math.floor(Math.random() * 20) / 10 - 0.5;
	mid_point_push = Math.floor(Math.random() * 8) / 4 - 1;
	new_size_influence = 0.5;
	mid_point_push = 0.25;
	max_line_width = Math.random() * 50 + 50;

 	var currentcolor = '#000000';
 	var backgroundcolor = '#FFFFFF';

 	var rect;
 	var lasttap;

var start = new function(){

	path = new Path();
	path.strokeColor = currentcolor;
	path.strokeWidth = 5;
}
// Only execute onMouseDrag when the mouse
// has moved at least 10 points:
tool.minDistance = 1;


rect = new Path.Rectangle({
    point: [0, 0],
    size: [view.size.width , view.size.height],
    selected: false
});
rect.sendToBack();
rect.fillColor = backgroundcolor;

Raster.prototype.rescale = function(width, height) {
    this.scale(width / this.width, height / this.height);
};

view.onResize = function(event) {
            console.log(event.size);
            rect = new Path.Rectangle({
              point: [0, 0],
              size: [event.size.width , event.size.height],
              selected: false
            });
            rect.sendToBack();
            rect.fillColor = backgroundcolor;


}


var firstLayer = project.activeLayer;
firstLayer.addChildren(rect);
var secondLayer = new Layer();
secondLayer.activate();



tool.onMouseMove = function(event) {
    // Create a new path every time the mouse is clicked

     if(!stopdraw && !beginWait)
   {
      mid_x = (end_x - start_x) * (1 + mid_point_push) + start_x;
      mid_y = (end_y - start_y) * (1 + mid_point_push) + start_y;
      start_x = end_x;
      start_y = end_y;
      end_x = event.point.x;
      end_y = event.point.y;
      distance = Math.ceil(Math.sqrt(Math.pow(end_x - start_x,2) + Math.pow(end_y - start_y,2)));
      if(distance == 0)
      {
         new_size = max_line_width / 90;
      }
      else
      {
        new_size = max_line_width / distance;
      }

      sizeM = new_size_influence * new_size + (1 - new_size_influence) * sizeM ;
      //console.log(new_size_influence  + "*" + new_size  + "+"  +(1 - new_size_influence) + "*" +  sizeM);

      splat(start_x,start_y,end_x,end_y,mid_x,mid_y,sizeM,event.delta);

     }
   else
   {
      start_x = event.point.x;
      start_y = event.point.y;
      end_x = event.point.x;
      end_y = event.point.y;
   }
   if(beginWait)
   {
      start_x = event.point.x;
      start_y = event.point.y;
      end_x = event.point.x;
      end_y = event.point.y;
      beginWait = false;
   }




    //path.add(event.point);
}

function splat(x1,y1,x2,y2,x3,y3,d,delta)
{
   var _loc5_ = new Path();
   _loc5_.strokeColor = currentcolor ;
   _loc5_.strokeCap = 'round';
   shadow = 1;
   _loc5_.strokeWidth = d;
   _loc5_.moveTo(x1,y1);
   _loc5_.curveTo(x3,y3,x2,y2);
   dd = Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
   var _loc2_ = 0;
   while(_loc2_ < Math.floor(5 * Math.pow(Math.random(),4)))
   {
      var _loc3_ = dd * 4 * (Math.pow(Math.random(),2) - 0.5);
      var _loc4_ = dd * 4 * (Math.pow(Math.random(),2) - 0.5);
      var _loc6_ = Math.random() - 0.5;
      var _loc7_ = Math.random() - 0.5;

  	  //direction
  	  var to = new Point(x1 + _loc3_ + _loc6_  ,y1 + _loc4_ + _loc7_ );
  	  //var c = new Path.Circle(to, d * (0.05 + Math.random()));
  	  var ElipseSize = d * (0.05 + Math.random());

	  var c = new Path.Ellipse({
	    center: to,
	    radius: [ ElipseSize,ElipseSize],
	    rotate: delta.angle,
	    fillColor: currentcolor
	  });
	   if(delta.length < 10){

	   		 var cX = x1 + ElipseSize * Math.cos(delta.angle);
			 var cY = y1 + ElipseSize * Math.sin(delta.angle);
	   		 var cCenter = new Point(cX,cY);
	   		 var r = new Path.Ellipse({
			    center: cCenter,
			    radius: [ ElipseSize*(.9 + Math.random()),ElipseSize*(.9 + Math.random())],
			    fillColor: currentcolor
	  			});
	   }

      _loc2_ = _loc2_ + 1;
   }
}



function keyIsDown(key){
	return false;
}

tool.onMouseDown = function(event) {

  currentcolor =  new Color(Math.random(255), Math.random(255), Math.random(255),255);

    var now = new Date().getTime();
    var timesince = now - lasttap;
     if((timesince < 300) && (timesince > 0)){
      project.clear();
     }else{

      stopdraw = false;
      end_x = event.point.x;
      end_y = event.point.y;
    }
    lasttap = new Date().getTime();



    return false;

}

tool.onKeyUp = function(event){

	switch (event.key) {
    case "space":
       secondLayer.clear();
       break;
    case "d":
      //68 d for black
      if(event.character == "D"){
         backgroundcolor = '#000000';
         rect.fillColor = backgroundcolor;
      }else{
        currentcolor = '#000000';
      }
      break;
    case "w":
      //87 W for white
      if(event.character == "W"){
        backgroundcolor = '#FFFFFF';
        rect.fillColor = backgroundcolor;
      }else{
      	currentcolor = '#FFFFFF';
      }
      break;
    case "r":
      //82 R for red
     if(event.character == "R"){
        backgroundcolor = '#FF0000';
        rect.fillColor = backgroundcolor;
      }else{
      	currentcolor = '#FF0000';
      }
      break;
    case "y":
    //89 Y for yellow
    if(event.character == "Y"){
        backgroundcolor = '#FFFF00';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#ffff00';
      }
      break;
    case "b":
     //66 B for Blue
    if(event.character == "B"){
        backgroundcolor = '#0000FF';
        rect.fillColor = backgroundcolor;
      }else{
      currentcolor = '#0000ff';
      }
      break;
    case "g":
    //71 G for Green
   if(event.character == "G"){
        backgroundcolor = '#00CC00';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#00cc00';
      }
      break;
    case "v":
    //86 V for violet
   if(event.character == "V"){
        backgroundcolor = '#FF00FF';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#ff00ff';
      }
      break;
    case "o":
    //79 O for Orange
    if(event.character == "O"){
        backgroundcolor = '#FF9900';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#ff9900';
      }
      break;
    case "q":
     //81 Q :color('#00FFFF
    if(event.character == "Q"){
        backgroundcolor = '#0000FF';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#00FFFF';
      }
      break;
    case "e":
    //69 E:Â color('#FFBF00
    if(event.character == "E"){
        backgroundcolor = '#FFBF00';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#FFBF00';
      }
      break;
    case "t":
    //84 T:Â color('#E32636
   if(event.character == "T"){
        backgroundcolor = '#E32636';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#E32636';
      }
    break;
    case "u":
    //85 U:Â color('#c26227
     if(event.character == "U"){
        backgroundcolor = '#c26227';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#c26227';
      }
      break;
    case "i":
    //73 I:Â color('#7BA05B
     if(event.character == "I"){
        backgroundcolor = '#7BA05B';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#7BA05B';
      }
      break;
    case "p":
     //80 P:Â color('#F5F5DC
     if(event.character == "P"){
        backgroundcolor = '#F5F5DC';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor ='#F5F5DC';
      }
      break;
    case "s":
    //83 S:Â color('#f88885
     if(event.character == "S"){
        backgroundcolor = '#f88885';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#f88885';
      }
      break;
    case "f":
    //70 F:Â color('#F0DC82
    if(event.character == "F"){
        backgroundcolor = '#F0DC82';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#F0DC82';
      }
      break;
    case "h":
    //72 H:Â color('#E97451
     if(event.character == "H"){
        backgroundcolor = '#E97451';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#E97451';
      }
      break;
    case "j":
    //74 J:Â color('#FBEC5D
     if(event.character == "J"){
        backgroundcolor = '#FBEC5D';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#FBEC5D';
      }
      break;
    case "k":
    //75 K:Â color('#FFFDD0
    if(event.character == "K"){
        backgroundcolor = '#FFFDD0';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#FFFDD0';
      }
      break;
    case "l":
     //76 L:Â color('#FED85D
    if(event.character == "L"){
        backgroundcolor = '#FED85D';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#FED85D';
      }
      break;
    case "z":
    //90 Z:Â color('#ae7250
    if(event.character == "Z"){
        backgroundcolor = '#ae7250';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#ae7250';
      }
      break;
    case "x":
    //88 X:Â color('#c5c7c4
    if(event.character == "X"){
        backgroundcolor = '#c5c7c4';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#c5c7c4';
      }
      break;
    case "c":
    //67 C:Â color('#808080
    if(event.character == "C"){
        backgroundcolor = '#808080';
        rect.fillColor = backgroundcolor;
      }else{
    currentcolor = '#808080';
      }
      break;
    case "n":
     //78 N:Â color('#6C6961
    if(event.character == "N"){
        backgroundcolor = '#6C6961';
        rect.fillColor = backgroundcolor;
      }else{
     currentcolor = '#6C6961';
      }
      break;
    case "!":
    	backgroundcolor = '#F0F0F0';
    	rect.fillColor = backgroundcolor;
      break;
    case "1":
    	currentcolor = '#F0F0F0';
      break;
    case "\"":
    	backgroundcolor = '#D4D4D4';
    	rect.fillColor = backgroundcolor;
      break;
    case "2":
    	currentcolor = '#D4D4D4';
      break;
    case "#":
    	backgroundcolor = '#B8B8B8';
    	rect.fillColor = backgroundcolor;
      break;
    case "3":
    	currentcolor = '#B8B8B8';
      break;
    case "$":
    	backgroundcolor = '#9C9C9C';
    	rect.fillColor = backgroundcolor;
      break;
    case "4":
    	currentcolor = '#9C9C9C';
      break;
    case "%":
    	backgroundcolor = '#7F7F7F';
    	rect.fillColor = backgroundcolor;
      break;
    case "5":
    	currentcolor = '#7F7F7F';
      break;
    case "&":
    	backgroundcolor = '#636363';
    	rect.fillColor = backgroundcolor;
      break;
    case "6":
    	currentcolor = '#636363';
      break;
    case "/":
    	backgroundcolor = '#474747';
    	rect.fillColor = backgroundcolor;
      break;
    case "7":
    	currentcolor = '#474747';
      break;
    case "(":
    	backgroundcolor = '#2B2B2B';
    	rect.fillColor = backgroundcolor;
      break;
    case "8":
    	currentcolor = '#2B2B2B';
      break;
    case ")":
    	backgroundcolor = '#555F61';
    	rect.fillColor = backgroundcolor;
      break;
    case "9":
    	currentcolor = '#555F61';
      break;
    case "=":
    	backgroundcolor = '#8C979A';
    	rect.fillColor = backgroundcolor;
      break;
    case "0":
    	currentcolor = '#8C979A';
      break


  }
}

