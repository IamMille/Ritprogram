NodeList.prototype.forEach = Array.prototype.forEach;
NodeList.prototype.push = Array.prototype.push;
HTMLCollection.prototype.forEach = Array.prototype.forEach;

function $(str)  { return document.querySelector(str);    }
function $$(str) { return document.querySelectorAll(str); }

var $status, $mouse, $canvas; // so we can access these from myAppClasses.js


/////////////////////////////////////////////////////////////
window.onload = function() {
/////////////////////////////////////////////////////////////

$status = new Status();
$mouse  = new Mouse();
$canvas = new Canvas();

// Fullscreen canvas
window.addEventListener("resize", () => {
  $("canvas").width = window.innerWidth;
  $("canvas").height = window.innerHeight;
});
window.dispatchEvent(new Event("resize")); // trigger resize


// Events BUTTONS
$$("button, input[type='color']").forEach(btn =>  // buttons AND colorpicker
{

  btn.addEventListener("mouseover", event =>
  {
    if ($mouse.isDrawing()) return;

    var btnName = btn.innerText || btn.tagName; // tagName to get colorpicker
    var btnDescription = {
      INPUT: "Click to choose drawing color", // colorpicker
      New: "Removes everything from the canvas",
      Triangle: "Use to draw a tringle",
      Rectangle: "Use to draw a rectangle",
      Circle: "Use to draw a circle",
      Polygon: "Use to draw a Polygon",
      Import: "Import figures from JSON",
      Export: "Export figures to JSON",
      IMPORT: "Click to import figures", // button in dialog
      CLOSE: "Click to close dialog" // button in dialog
    };

    $status.set(btnDescription[btnName], true);
  });


  btn.addEventListener("mouseleave", event => {
    if (!$mouse.isDrawing()) $status.restore();
  });


  btn.addEventListener("click", event =>
  {
    var btnName = btn.innerText;
    if (btnName == "Export") $canvas.openExport();
    else if (btnName == "Import") $canvas.openImport();
    else if (btnName == "CLOSE") $canvas.closeExport(); // Export dialog
    else if (btnName == "IMPORT") $canvas.closeImport();
    else if (btnName == "New") $canvas.clear();
    else if (btnName == "Menu") {
      var isOpen = $("menu").classList.contains('slide-in');
      $("menu").setAttribute('class', isOpen ? 'slide-out' : 'slide-in');
    }
    else {
      $mouse.startDrawing(btnName);
      $mouse.addClickCords(); // empty, to just update status
    }
  });

}); // end forEach buttons

// Events CANVAS
$("canvas").addEventListener("dblclick", event =>
{
   if ($mouse.isDrawing() != "Polygon") return;

   var cords = $mouse.getClickCords().slice(0,-2); // dblClick, remove last click cords
   var color = $mouse.getDrawingColor();
   new Polygon(cords, color).draw($canvas);

   $mouse.endDrawing();
});

$("canvas").addEventListener("click", event =>
{
  if (!$mouse.isDrawing()) return; // go home, you are drunk

  $mouse.addClickCords(event.clientX, event.clientY);

  if (!$mouse.isAllCords()) return; // else continue, drawing is complete

  var cords = $mouse.getClickCords();
  var color = $mouse.getDrawingColor();

  switch($mouse.isDrawing()) {
    case 'Rectangle': new Rectangle(cords, color).draw($canvas); break;
    case 'Triangle':  new Triangle(cords, color).draw($canvas); break;
    case 'Circle':    new Circle(cords, color).draw($canvas); break;
    case 'Polygon':   // is handled in the dbclick event
  }

  $mouse.endDrawing();
});

// Escape to abort drawing
document.addEventListener("keyup", event =>
{
  if (event.keyCode == 27) // escape
    if ($mouse.isDrawing())
        $mouse.endDrawing();
});

/////////////////////////////////////////////////////////////
setTimeout( () => { $status.remove(); }, 1000); // not triggered if errors :-)
/////////////////////////////////////////////////////////////
}; // end onLoad
