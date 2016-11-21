/**
 * Sebastian 2016-11-08
 * SAMMANFATTNING:
 * Det finns gemensamma methoder som ärvs ifrån objektet Figure.
 * Funktionerna innehåller ingen nämnvärd validering.
 * Ca 200 rader kod.
**/

// ###############################  COMMON ###############################


function Figure() {} //http://tobyho.com/2010/11/22/javascript-constructors-and/
Circle.prototype    = Object.create(Figure.prototype); // inheritance
Rectangle.prototype = Object.create(Figure.prototype); // inheritance
Triangle.prototype  = Object.create(Figure.prototype); // inheritance
Polygon.prototype   = Object.create(Figure.prototype); // inheritance
//Polygon.prototype.constructor = Figur; // not needed for inheritance

Figure.prototype.points = function()
{
	var points = [];
	for (let i=0; i<this.cords.length; i+=2)
		points.push( { x: this.cords[i],
                   y: this.cords[i+1] } );
	return points;
};

Figure.prototype.move = function(dx, dy)
{
	for (let i=0; i<this.cords.length; i+=2) {
		this.cords[i] += dx;
    this.cords[i+1] += dy;
  }
	return this; // so we can use nested method calls, like: new Circle().move().somethingElse()
};

Figure.prototype.figureType = function()
{
	if (this instanceof Circle)    return "Circle";
	if (this instanceof Rectangle) return "Rectangle";
	if (this instanceof Triangle)  return "Triangle";
	if (this instanceof Polygon)   return "Polygon";
	if (this instanceof Figure)    return "Figure";
	else return "Filur";
};

Figure.prototype.distanceTo = function(otherFigure)
{
 	var PointsFigureA = this.points(),
 		  PointsFigureB = otherFigure.points();

 	var smallestDistance = Infinity;

 	PointsFigureA.forEach( one => {
 		PointsFigureB.forEach( two => {
 			var d = this.distancePoints(one, two);
	 		if (d < smallestDistance)
	 			smallestDistance = d;
 		});
 	});

 	switch ( this.figureType() )
 	{
	 	case "Polygon": // between points, not sides unfortunately
	 		return smallestDistance;

	 	case "Circle":   // sqrt( (x2 − x1)^2 + (y2 − y1)^2 ) − (r2 + r1)
	 		var d = smallestDistance - (this.radius + otherFigure.radius);
	 		return (d > 0 ? d : 0);

	 	case "Rectangle": // has it's own method (since we calc dist from center of rectangles)
	 	case "Triangle":  // not needed (sinced removed from the assignment)
 	}
};

Figure.prototype.distancePoints = function(one, two)
{
	var dx = one.x - two.x,
  		dy = one.y - two.y;

	return Math.sqrt( dx*dx + dy*dy );
};

Figure.prototype.width = function ()
{
	var allX = this.cords.filter( (e,i) => i%2===0 );
	return Math.max.apply(null, allX) -
  		   Math.min.apply(null, allX);
};

Figure.prototype.height = function ()
{
	var allY = this.cords.filter( (e,i) => i%2===1 );
	return Math.max.apply(null, allY) -
  		   Math.min.apply(null, allY);
};


// ###############################  CIRCLE ###############################

function Circle(args) //(x, y, radius)
{
	//this.cords  = [x, y];
	//this.radius = radius;
	this.cords = [ args[0], args[1] ];
	this.radius = this.distancePoints(
		{x: args[0], y: args[1]},
		{x: args[2], y: args[3]}
	);
}

Circle.prototype.boundingBox = function()
{
	var points = this.points();
	return new Rectangle( points[0].x - this.radius, points[0].y - this.radius,   //lower left
						            points[0].x + this.radius, points[0].y + this.radius ); //upper right
};

Circle.prototype.area = function () { return this.radius * this.radius * Math.PI; };

Circle.prototype.draw = function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	var ctx = canvas.getContext("2d");
	ctx.beginPath();
	ctx.arc( this.cords[0],this.cords[1],
					 this.radius, 0, Math.PI*2 );
	ctx.stroke();
};

// ##############################  RECTANGLE ##############################

function Rectangle(args) //(x1,y1, x3,y3)
{
	if (args.length > 4) throw new Error("To many arguments");
	this.cords = args;
}
Rectangle.prototype.draw = function()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var ctx = canvas.getContext("2d");
	var myRect = [ this.cords[0], this.cords[1],
								 this.width() , this.height() ];
	ctx.rect.apply(ctx, myRect);
	ctx.stroke();
};

Rectangle.prototype.center = function()
{
	return { x: this.cords[0] + this.width()  /2,
			     y: this.cords[5] + this.height() /2 }; //TODO min/max? -----------------------------------------------
};

Rectangle.prototype.area = function() { return this.width() * this.height(); };

Rectangle.prototype.distanceTo = function(otherFigure)
{
	return this.distancePoints( this.center(),
								              otherFigure.center() );
};


// ##############################  TRIANGLE ##############################

function Triangle(args)
{
	//this.cords  = [x1,y1, x2,y2, x3,y3];
	this.cords  = args;
}

Triangle.prototype.area = function()
{
	var points = this.points();

	var a = this.distancePoints( points[0], points[1] ),
      b = this.distancePoints( points[1], points[2] ),
      c = this.distancePoints( points[2], points[0] );

	var area = (points[0].x * (points[1].y - points[2].y) +
			        points[1].x * (points[2].y - points[0].y) +
			        points[2].x * (points[0].y - points[1].y))/2;

	return Math.abs(area);
};

Triangle.prototype.boundingBox = function()
{
  var points = this.points();

	var x = Math.min(points[0].x, points[1].x, points[2].x),
		  y = Math.min(points[0].y, points[1].y, points[2].y);

	return new Rectangle( x, y,
						            x + this.width(), y + this.height() );
};


// ##############################  POLYGON ##############################

function Polygon(args) //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/arguments
{
	if (args.length <= 6)
		throw new Error("At least three cordinates needed for Polygon.");

	if (args.length%2 !== 0)
		throw new Error("Number of X and Y cordinates needs to match.");

	this.cords = args;
}

Polygon.prototype.draw = function()
{
	var canvas = document.getElementsByTagName("canvas")[0];
	var ctx = canvas.getContext('2d');

	ctx.beginPath();
	ctx.lineWidth = "2";
	ctx.moveTo( this.cords[0], this.cords[1]);
	for (var i = 2; i<this.cords.length; i+=2)
		ctx.lineTo(this.cords[i],
							this.cords[i+1]);
	ctx.closePath();
	ctx.stroke();
};

Polygon.prototype.area = function() //http://www.mathopenref.com/coordpolygonarea.html
{
	var sum = 0,
		  cords = this.cords;

	for (let i=0; i<cords.length; i+=2)
	{
		var x1 = cords[i],
  		 	y1 = cords[i+1],
  		 	x2 = cords[i+2] || cords[0],
  		 	y2 = cords[i+3] || cords[1];

		sum += (x1*y2)-(y1*x2);
	}

	return Math.abs(sum/2); //-2
};

Polygon.prototype.boundingBox = function()
{
	var points = this.points();

	var minX = Math.min.apply( null, this.cords.filter( (e,i) => i%2===0 ) ),
		  minY = Math.min.apply( null, this.cords.filter( (e,i) => i%2===1 ) );

	return new Rectangle( minX, minY,
						            minX + this.width(), minY + this.height() );
};

// needs to be after all declarations
Triangle.prototype.draw = Polygon.prototype.draw;

//}); // end onload
