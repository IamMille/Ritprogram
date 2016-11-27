
class Status {
  constructor() {
    this.status = $("footer span");
    this.save = false;
    this.old = null;
  }
  set(msg, save) {
    if (save) this.old = this.status.innerText;
    if (msg) this.status.innerText = msg;
    else console.trace("Trace: Status called with undefined"); // dont use in production
  }
  restore() {
    if (this.old) this.set(this.old);
    this.save = false;
  }
  remove() {
    this.status.innerText = "~"; //This is the default statusbar text
  }
}

class Canvas {
  constructor() {
    this.elm = $("canvas");
    this.ctx = this.elm.getContext("2d");
    this.drawings = [];
    this.drawingColor = "black";
    this.setRandomColor();
  }
  clear() {
    //this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.elm.width, this.elm.height);
    this.drawings = [];
    this.setRandomColor();
    $status.set("Canvas cleared");
  }
  addDrawing(obj) { // used by "figure".draw()
    this.drawings.push(obj);
    console.log(this.drawings.length);
    this.setRandomColor();
  }
  getDrawings() {
    return this.drawings;
  }
  openImport() {
    $("dialog").style.display = "block";
    $("dialog p").innerText = "Import from JSON:";
    $("dialog button").innerText = "IMPORT";
    $("dialog textarea").focus();
    //DEBUG $("dialog textarea").value = '[{"figure":"Triangle","cords":[144,187,107,245,172,248]},{"figure":"Triangle","color":"red","cords":[111,198,172,206,141,266]},{"figure":"Polygon","color":"green","cords":[241,300,214,356,191,305,261,341,185,324,242,297,242,297]}]';
  }
  closeImport() {
      var json = $("dialog textarea").value;
      $("dialog textarea").value = "";
      $("dialog").style.display = "none";

      if (!json.length) return;
      var listFigures = JSON.parse(json);

      listFigures.forEach(e => {
        switch(e.figure) {
          case 'Rectangle': new Rectangle(e.cords, e.color).draw($canvas); break;
          case 'Triangle': new Triangle(e.cords, e.color).draw($canvas); break;
          case 'Circle': new Circle(e.cords, e.color).draw($canvas); break;
          case 'Polygon': new Polygon(e.cords, e.color).draw($canvas); break;
        }
      });
  }
  openExport() {
    $("dialog").style.display = "block";
    $("dialog p").innerText = "Export to JSON:";
    $("dialog button").innerText = "CLOSE";
    $("dialog textarea").value = JSON.stringify(this.getDrawings());
    $("dialog textarea").select();
  }
  closeExport() {
    $("dialog").style.display = "none";
  }
  setRandomColor() {
    var randomColor = [ "#7F00FF","#00FFFF","#FF00FF","#0000FF",
                        "#FFFF00","#FF0000","#00FF00","#FF7F00"];
    $("input[type='color']").value = randomColor[this.drawings.length] || "#000";
  }
  toggleMenu() {
    var isOpen = $("menu").classList.contains('slide-in');
    $("menu").setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
  }
}

class Mouse {
  constructor() {
    this._isDrawing = false;
    this._isDrawingNumCords = null;
    this._cords = [];
  }
  startDrawing(figure) {
    var figureNumCords = { Rectangle: 2, Triangle: 3, Circle: 2, Polygon: Infinity };
    this._isDrawingNumCords = figureNumCords[figure];
    this._isDrawing = figure;
    $("canvas").style.cursor = "crosshair";
  }
  isDrawing() {
    return this._isDrawing; // returns the name of the figure
  }
  addClickCords(x, y) {
    if (x && y) this._cords.push(x, y); // NEW

    if (this._isDrawing == "Polygon")
      $status.set( $mouse._isDrawing + ": click to add points, end with a dubbelclick... (ESC to abort)" );
    else
      $status.set( $mouse._isDrawing + ": click " +
        this.numCordsLeft() + " point(s) on the canvas... (ESC to abort)" );
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
    $("canvas").style.cursor = "default";
    $status.remove();
    $mouse = new Mouse(); // reset
  }
  getDrawingColor() {
    return $("input[type='color']").value;
  }

}
