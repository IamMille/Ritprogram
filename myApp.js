
window.onload = function() {
////////////////////////////
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
////////////////////////////


class Canvas {
  constructor() {
    this.elm = document.getElementsByTagName("canvas")[0];
    this.ctx = this.elm.getContext("2d");
  }
  clear() {
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.elm.width, this.elm.height);
    status.set("Canvas cleared.");
  }

}
class Status {
  constructor() {
    this.status = document.getElementsByTagName("aside")[0];
    this.save = false;
    this.old = null;
  }
  set(msg, save) {
    if (save) this.old = this.status.innerText;
    if (msg) this.status.innerText = msg;
    else console.trace("Status called with undefined"); // dont use in production
  }
  restore() {
    if (this.old) this.set(this.old);
    this.save = false;
  }
  remove() {
    this.status.innerText = "This is the default statusbar text";
  }
}

class Mouse {
  constructor() {
    this._isDrawing = false;
    this._isDrawingNumCords = null;
    this._cords = [];
  }
  startDrawing(figure) {
    canvas.style.cursor = "crosshair";
    var figureNumCords = {
      Rectangle: 2, Triangle: 3, Circle: 2, Polygon: Infinity
    };
    this._isDrawingNumCords = figureNumCords[figure];
    this._isDrawing = figure;
  }
  isDrawing() {
    return this._isDrawing;
  }
  addClickCords(x, y) {
    this._cords.push(x, y);

    if (this._isDrawing == "Polygon")
      status.set( $mouse._isDrawing + ": click to add points, dubbelclick to end." );
    else
      status.set( $mouse._isDrawing + ": click " +
        this.numCordsLeft() + " point(s) on the canvas..." );
  }
  getClickCords() {
    return this._cords;
  }
  isAllCords() {
    return (this._isDrawingNumCords == this._cords.length/2);
  }
  numCordsLeft() {
    return (this._isDrawingNumCords - this._cords.length/2);
  }
  endDrawing() {
    canvas.style.cursor = "default";
    status.remove(this._isDrawing + " complete.");
    //if (this._isDrawing == "Polygon") this._cords.splice(-2,2);
    this._isDrawing = null;
    this._isDrawingNumCords = null;
    this._cords = [];
    $mouse = new Mouse();
  }
}


var status  = new Status();
var $mouse  = new Mouse();
var $canvas = new Canvas();

//var main = document.getElementsByTagName("main")[0];
var nav = document.getElementsByTagName("nav")[0];
var buttons = nav.getElementsByTagName('button');
var canvas = document.getElementsByTagName("canvas")[0];

// Full screen canvas
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight-15; }, false
);
window.dispatchEvent(new Event("resize")); // trigger resize

// Events BUTTONS
buttons.forEach(btn =>
{
  btn.addEventListener("mouseover", event =>
  {
    if ($mouse.isDrawing()) return;
    var btnName = btn.innerText;
    var btnDescription = {
      New: "Removes everything from the canvas",
      Triangle: "Use to draw a tringle", // TODO: all the other buttons
      Rectangle: "Use to draw a rectangle"
    };
    status.set( btnDescription[btnName] || btnName, true);
  });

  btn.addEventListener("mouseleave", event => {
    if (!$mouse.isDrawing) status.restore();
  });


  btn.addEventListener("click", event => {

    var btnName = btn.innerText;
    if (btnName == "New") {
       $canvas.clear();
       return;
    }

    var btnAction = {
      Triangle: "Triangle: click 3 point(s) on the canvas...",
      Rectangle: "Rectangle: click 2 point(s) on the canvas...",
      Circle: "Circle: click 2 point(s) on the canvas...",
      Polygon: "Polygon: click on canvas to add points, end with a dubbelclick."
    };

    status.set( btnAction[btnName] || "click " + btnName);
    $mouse.startDrawing(btnName);
  });
}); // end forEach buttons


// Events CANVAS
canvas.addEventListener("dblclick", event => {
   if ($mouse.isDrawing() == "Polygon") {
     var cords = $mouse.getClickCords().slice(0,-2);
     new Polygon(cords).draw();
     $mouse.endDrawing();
   }
});

canvas.addEventListener("click", event => {

  if ($mouse.isDrawing())
  {
    $mouse.addClickCords(event.clientX, event.clientY);

    if ($mouse.isAllCords())  //drawing complete
    {
      var cords = $mouse.getClickCords();

      switch($mouse.isDrawing()) {
        case 'Rectangle':
          new Rectangle(cords).draw(); break;
        case 'Triangle':
          new Triangle(cords).draw(); break;
        case 'Circle':
          new Circle(cords).draw(); break;
        case 'Polygon': // is handled in the dbclick event instead
      }
      $mouse.endDrawing();
    }

  }
});


/////////////////
setTimeout( () => { status.remove(); }, 1500);
/////////////////
}; // end onLoad
