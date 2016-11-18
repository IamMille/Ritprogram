
function run() {
////////////////////////////
NodeList.prototype.forEach = Array.prototype.forEach;
HTMLCollection.prototype.forEach = Array.prototype.forEach;
////////////////////////////

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
    this.set("");
  }
}

var status = new Status();
//var status = document.getElementsByTagName("aside")[0];
var main = document.getElementsByTagName("main")[0];
var nav = document.getElementsByTagName("nav")[0];
var buttons = nav.getElementsByTagName('button');
var canvas = document.getElementsByTagName("canvas")[0];

// Full screen canvas
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight; }, false
);
window.dispatchEvent(new Event('resize'));

// Events
main.addEventListener("mousemove", event => {
    status.set( "" + event.clientX + "x" + event.clientY );
});

buttons.forEach(btn =>
{

  btn.addEventListener("mouseover", event =>
  {
    var btnDescription = {
      New: "Create a new clean canvas",
      Triangle: "This is a triangle if you didn't know"
    };
    status.set( btnDescription[btn.innerText], true);

  });

  btn.addEventListener("mouseleave", event => status.restore() );

  btn.addEventListener("click", event => {
    status.set("click " + event.target.innerText);
  });
}); // end forEach buttons

/////////////////
setTimeout( () => { status.set("This is the default statusbar text"); }, 1500);
/////////////////
} // end onLoad
