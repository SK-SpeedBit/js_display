
/*
    ------------------------   js_display  ----------------------------
      (c) 2019 SpeedBit, reg. Czestochowa, Poland 
    --------------------------------------------------------------------
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/


// ------------------------------- one display --------------------------------------
class js_d7 {

  get width ()  { return this.iwidth ; }
  get height()  { return this.iheight; }
  get oncol ()  { return this.ioncol ; }
  set width (w) { this.iwidth  = w; this.iheight = w / this.prop; this.int_init(); }
  set height(h) { this.iheight = h; this.iwidth  = h * this.prop; this.int_init(); }
  set oncol (c) { this.ioncol  = c; this.offcol  = this.dimm(this.oncol, this.dimdiv); }
  
  constructor (container, hsize, oncol, ovrcol, backcol) {
    this.marg   =  0;  // margin of display
    this.dimdiv =  4;
    this.prop = 12/17; // proportions of display
    this.sang =  8;    // angle of display
    this.sw   =  6;    // segment width
    this.sm   =  this.sw / 2; //segment margin
    
    this.black   = "rgba(  0,   0,   0, 1)"; // std display acground color (const)
    this.green   = "rgba(  0, 255,   0, 1)"; // std segment color green (const)
    this.red     = "rgba(255,   0,   0, 1)"; // std segment color red   (const)
    this.blue    = "rgba(  0, 150, 255, 1)"; // std segment color blue  (const)
    
    this.backcol = this.black; // display bacground color
    this.oncol   = this.green; // segment on color (off color is auto calculated with property: dimdiv)
    this.ovrcol  = this.red;   // overflow error color

    // ------ Internal ------------------------------------------

    if (typeof oncol   != "undefined") this.oncol   = oncol  ;
    if (typeof ovrcol  != "undefined") this.ovrcol  = ovrcol ;
    if (typeof backcol != "undefined") this.backcol = backcol;
    
    this.offcol  = this.dimm(this.oncol, this.dimdiv); // segment off color (auto calculated)
 
    this.canvas = document.createElement("canvas"); this.canvas.id = "canvas";
    document.getElementById(container).appendChild(this.canvas);
    this.ctx    = this.canvas.getContext("2d"); 

    this.left = 0;    // left position
    this.top  = 0;    // right position
    this.height  = hsize;
    
    this.dl = this.left  + this.marg;
    this.dr = this.width - this.marg;
    this.dt = this.top   + this.marg;
    this.db = this.height- this.marg;
    this.dv = this.height - 2 * this.marg;
    this.dh = this.width  - 2 * this.marg;

    this.value = -1;    // value on display
    this.point = false; // point on display
    this.empty = true;  // nothing on display
    this.sframe= false; // lines only for debug

    this.sdiv  = true;        // segment divider
    this.sdivw = this.sw / 2; // segment divider width
    this.sdivstop = 0;        // segment divider angle stop

    this.int_init();
  }
  
  
  int_init () {
    let ma = Math.atan(this.width / this.height) * 180 / Math.PI;
    this.sdivstop = ma/2;     // segment divider angle stop

    this.sw = this.height / 12;
    this.sdivw = this.sw / 2;
    this.sm    = this.sw / 2;
    
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height= this.height;
    // draw canvas fill
    this.ctx.fillStyle = "rgba(250, 250, 0, 0.2)"; // canvas color
    this.ctx.rect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.stroke();
    this.ctx.fill();
  }
  

  
  dimm(rgba, div) { 
    let rgbamode = false;
    let res = "";
    if (typeof rgba == "undefined") return rgba;
    if ( rgba.includes("rgba") ) rgbamode = true;
    if ( !rgba.includes("rgb") && !rgbamode) return -2;
    if (typeof div == "undefined") div = 4;
    let str = rgba.split(",");
    let str2 = str[0].split("(");
    let str3 = str[3 - !rgbamode].split(")");
    str[3] = "aaa" + ")";
    if ( rgbamode ) 
      res = str2[0] + "(" + str2[1] / div + "," + str[1] / div + "," + str[2] / div + "," + str3[0] + ")"
    else
      res = str2[0] + "(" + str2[1] / div + "," + str[1] / div + "," + str3[0] / div+ ")"
    return res;
  }
  
  
  
  ovr_alarm() {
    var tmp = this.oncol;
    this.oncol = this.ovrcol;
    this.value = 'E';
    this.redraw();
    this.oncol = tmp;
  }
  
  
  
  draw_segm(a, b, c, d, e, f, g, p) {
    let s = this;
    let p1  = { x:0, y:0};
    let p2  = { x:0, y:0};
    let p3  = { x:0, y:0};
    let p4  = { x:0, y:0};
    let p5  = { x:0, y:0};
    let p6  = { x:0, y:0};
    let p7  = { x:0, y:0};
    let p8  = { x:0, y:0};
    let p9  = { x:0, y:0};
    let p10 = { x:0, y:0};
    let p11 = { x:0, y:0};
    let p12 = { x:0, y:0};
    let p13 = { x:0, y:0};
    let p14 = { x:0, y:0};
    let p15 = { x:0, y:0};
  
    
    function drawline(pf, pt, state) {
      s.ctx.save();
      s.ctx.beginPath();
      s.ctx.lineCap = "round"; 
      s.ctx.lineWidth = s.sw;
      if (state == true) {
        var col = s.oncol;
        s.ctx.strokeStyle = col;
        s.ctx.fillStyle   = s.oncol;
      }
      else {
        s.ctx.strokeStyle = s.offcol;
        s.ctx.fillStyle   = s.offcol;
      }

      s.ctx.moveTo(pf.x, pf.y);
      s.ctx.lineTo(pt.x, pt.y);
      s.ctx.stroke();
      s.ctx.closePath();
      s.ctx.restore();
    }
    
    
    function incX(p, inc) { return { x:p.x + inc, y:p.y }; }
    function incY(p, inc) { return { x:p.x, y:p.y + inc }; }
    
    // display background
    this.ctx.fillStyle = this.backcol;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.rect(this.dl, this.dt, this.dh, this.dv);
    this.ctx.fill();
    this.ctx.closePath();    
       
    if (this.sframe) {
      this.ctx.beginPath();
      this.ctx.lineCap = "round"; 
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "rgba(250,250,0,1)";
      this.ctx.fillStyle   = "rgba(250,250,0,1)";
      this.ctx.moveTo(0, this.ctx.canvas.height/2);
      this.ctx.lineTo(this.ctx.canvas.width, this.ctx.canvas.height/2);
      this.ctx.moveTo(0                    , this.db - this.sm - this.sw/2);
      this.ctx.lineTo(this.ctx.canvas.width, this.db - this.sm - this.sw/2);
      this.ctx.moveTo(0                    , this.dt + this.sm + this.sw/2);
      this.ctx.lineTo(this.ctx.canvas.width, this.dt + this.sm + this.sw/2);
      this.ctx.moveTo(this.ctx.canvas.width/2, 0);
      this.ctx.lineTo(this.ctx.canvas.width/2, this.ctx.canvas.height);
      this.ctx.moveTo(this.dl + this.sm + this.sw/2, 0);
      this.ctx.lineTo(this.dl + this.sm + this.sw/2, this.ctx.canvas.height);
      this.ctx.moveTo(this.dr - this.sm - this.sw/2, 0);
      this.ctx.lineTo(this.dr - this.sm - this.sw/2, this.ctx.canvas.height);
      this.ctx.stroke();
      this.ctx.closePath();
    }

    // segments
    let pr = Math.sqrt(Math.pow((this.dv - this.sm * 2 - this.sw * 2), 2) + Math.pow((this.dh - this.sm * 2 - this.sw * 1), 2) )
    let hr = (pr) * Math.sin(this.sang * Math.PI / 180);
    let vr = (pr) * Math.cos(this.sang * Math.PI / 180);
    if (vr > this.dv - this.sm * 2 - this.sw * 2) vr = this.dv - this.sm * 2 - this.sw * 2;
    if (hr > this.dh - this.sm * 2 - this.sw * 1) hr = this.dh - this.sm * 2 - this.sw * 1;
    
    p1.x = this.dl + this.sm + this.sw * 0.5;
    p1.y = this.db - this.sm - this.sw * 1;
    p2.x = this.dl + this.sm + hr / 2 + this.sw/2 - (this.sw*0.5 * Math.sin(this.sang * Math.PI / 180));
    p2.y = this.db - this.sm - vr / 2 - this.sw   + (this.sw*0.5 * Math.cos(this.sang * Math.PI / 180));
    p3.x = this.dl + this.sm + hr / 2 + this.sw/2 + (this.sw*0.5 * Math.sin(this.sang * Math.PI / 180));
    p3.y = this.db - this.sm - vr / 2 - this.sw   - (this.sw*0.5 * Math.cos(this.sang * Math.PI / 180));
    p4.x = this.dl + this.sm + hr + this.sw*0.5;
    p4.y = this.db - this.sm - vr - this.sw;
    drawline(p1, p2, e);
    drawline(p3, p4, f);   

    let rc = this.dr - this.sm - this.sw*0.5;
    rc = rc - p4.x;
    p5 = incX(p1, rc);
    p6 = incX(p2, rc);
    p7 = incX(p3, rc);
    p8 = incX(p4, rc);
    drawline(p5, p6, c);
    drawline(p7, p8, b);
    
    p9  = incY(p1 ,  this.sw/2);
    p10 = incY(p5 ,  this.sw/2);
    p9  = incX(p9 ,  this.sw/2);
    p10 = incX(p10, -this.sw/2);
    if (p10.x < p9.x)  { p9 = p5; p10 = p5; }
    drawline(p9, p10, d);

    rc = (p4.x - p1.x) / 2;
    p11 = incY(p1, -vr/2);
    p12 = incY(p5, -vr/2);
    p11 = incX(p11, rc + this.sw/2);
    p12 = incX(p12, rc - this.sw/2);
    if (p12.x < p11.x) { p11 = p1; p12 = p1; }
    drawline(p11, p12, g);

    p13 = incY(p4,  -this.sw/2);
    p14 = incY(p8,  - this.sw/2);
    p13 = incX(p13,  this.sw/2);
    p14 = incX(p14, -this.sw/2);
    if (p14.x < p13.x) { p13 = p4; p14 = p4 }
    drawline(p13, p14, a);
    
    p15.y = p10.y;
    p15.x = p8.x;
    drawline(p15, p15, p);
    
    if (this.sang > this.sdivstop ) return;
    
    if (this.sdiv) {
      this.ctx.beginPath();    
      this.ctx.fillStyle= this.backcol;
      
      this.ctx.moveTo(p5.x + this.sw/2, p10.y - this.sw/4);
      this.ctx.lineTo(p5.x - this.sw/4, this.db);
      this.ctx.lineTo(p5.x + this.sw/2, this.db);

      this.ctx.moveTo(p1.x - this.sw/2, p9.y - this.sw/4);
      this.ctx.lineTo(this.dl         , this.db);
      this.ctx.lineTo(p1.x + this.sw/4, this.db);

      this.ctx.moveTo(p8.x + this.sw/2, p14.y + this.sw/4);
      this.ctx.lineTo(p8.x - this.sw/4, this.dt);
      this.ctx.lineTo(p8.x + this.sw/2, this.dt);
      
      this.ctx.moveTo(p4.x - this.sw/2, p13.y + this.sw/4);
      this.ctx.lineTo(p4.x - this.sw/2, this.dt);
      this.ctx.lineTo(p4.x + this.sw/2, this.dt);

      let ps = Math.sin(this.sang * Math.PI / 180);
      this.ctx.moveTo(p2.x - this.sw/2 - (p7.x - p6.x)/1 , p11.y + this.sw/2 + this.sdivw/2);
      this.ctx.lineTo(p3.x - this.sw/2 - (p7.x - p6.x)/2 , p11.y - this.sw/2 - this.sdivw/2);
      this.ctx.lineTo( (p3.x - p2.x) / 2 + p2.x + this.sdivw / 2, p11.y );

      this.ctx.moveTo( p7.x + this.sw / 2 + (p7.x-p6.x)/1 , p12.y - this.sw / 1 );
      this.ctx.lineTo( p6.x + this.sw / 2 + (p6.x-p7.x)/2 , p12.y + this.sw / 1 );
      this.ctx.lineTo( (p7.x - p6.x) / 2 + p6.x - this.sdivw / 2, p12.y );

      this.ctx.fill();
      this.ctx.closePath();    

      this.ctx.beginPath();    
      this.ctx.lineCap = "butt"; 
      this.ctx.lineWidth = this.sdivw;
      this.ctx.strokeStyle= this.backcol;

      this.ctx.moveTo(p5.x + this.sw/4, p10.y+ this.sw/4);
      this.ctx.lineTo(p3.x, p11.y);

      this.ctx.moveTo(p1.x - this.sw/4, p9.y + this.sw/4);
      this.ctx.lineTo(p7.x , p12.y);

      this.ctx.moveTo(p6.x , p12.y);
      this.ctx.lineTo(p4.x - this.sw/4, p13.y - this.sw/4);

      this.ctx.moveTo(p2.x , p12.y);
      this.ctx.lineTo(p8.x + this.sw/4, p13.y- this.sw/4);

      this.ctx.stroke();
      this.ctx.fill();
      this.ctx.closePath();    
    }
    
    if ((a==0) && (b==0) && (c==0) && (d==0) && (e==0) && (f==0) && (g==0) && (p==0))
      this.emty = true;
    else 
      this.empty= false;
      
  }


  draw(num, p) {
    if (typeof num == "undefined") return;
    let a=0; 
    let b=0; 
    let c=0; 
    let d=0; 
    let e=0; 
    let f=0; 
    let g=0;
    if (typeof num == "number") num = Math.floor(num);
    if (typeof num == "string"  ) { num = num.toLowerCase(); num =  num[0]; }
    switch (num) {
      case   0 : {a=1; b=1; c=1; d=1; e=1; f=1; g=0; break;}
      case   1 : {a=0; b=1; c=1; d=0; e=0; f=0; g=0; break;}
      case   2 : {a=1; b=1; c=0; d=1; e=1; f=0; g=1; break;}
      case   3 : {a=1; b=1; c=1; d=1; e=0; f=0; g=1; break;}
      case   4 : {a=0; b=1; c=1; d=0; e=0; f=1; g=1; break;}
      case   5 : {a=1; b=0; c=1; d=1; e=0; f=1; g=1; break;}
      case   6 : {a=1; b=0; c=1; d=1; e=1; f=1; g=1; break;}
      case   7 : {a=1; b=1; c=1; d=0; e=0; f=0; g=0; break;}
      case   8 : {a=1; b=1; c=1; d=1; e=1; f=1; g=1; break;}
      case   9 : {a=1; b=1; c=1; d=1; e=0; f=1; g=1; break;}
      case  '0': {a=1; b=1; c=1; d=1; e=1; f=1; g=0; break;}
      case  '1': {a=0; b=1; c=1; d=0; e=0; f=0; g=0; break;}
      case  '2': {a=1; b=1; c=0; d=1; e=1; f=0; g=1; break;}
      case  '3': {a=1; b=1; c=1; d=1; e=0; f=0; g=1; break;}
      case  '4': {a=0; b=1; c=1; d=0; e=0; f=1; g=1; break;}
      case  '5': {a=1; b=0; c=1; d=1; e=0; f=1; g=1; break;}
      case  '6': {a=1; b=0; c=1; d=1; e=1; f=1; g=1; break;}
      case  '7': {a=1; b=1; c=1; d=0; e=0; f=0; g=0; break;}
      case  '8': {a=1; b=1; c=1; d=1; e=1; f=1; g=1; break;}
      case  '9': {a=1; b=1; c=1; d=1; e=0; f=1; g=1; break;}
      case  ' ': {a=0; b=0; c=0; d=0; e=0; f=0; g=0; break;}
      case  'a': {a=1; b=1; c=1; d=0; e=1; f=1; g=1; break;}
      case  'b': {a=0; b=0; c=1; d=1; e=1; f=1; g=1; break;}
      case  'c': {a=0; b=0; c=0; d=1; e=1; f=0; g=1; break;}
      case  'd': {a=0; b=1; c=1; d=1; e=1; f=0; g=1; break;}
      case  'e': {a=1; b=0; c=0; d=1; e=1; f=1; g=1; break;}
      case  'f': {a=1; b=0; c=0; d=0; e=1; f=1; g=1; break;}
      case  'g': {a=1; b=0; c=1; d=1; e=1; f=1; g=1; break;}
      case  'h': {a=0; b=0; c=1; d=0; e=1; f=1; g=1; break;}
      case  'i': {a=0; b=1; c=1; d=0; e=0; f=0; g=0; break;}
      case  'j': {a=0; b=1; c=1; d=1; e=0; f=0; g=0; break;}
      case  'l': {a=0; b=0; c=0; d=1; e=1; f=1; g=0; break;}
      case  'n': {a=0; b=0; c=1; d=0; e=1; f=0; g=1; break;}
      case  'o': {a=0; b=0; c=1; d=1; e=1; f=0; g=1; break;}
      case  'p': {a=1; b=1; c=0; d=0; e=1; f=1; g=1; break;}
      case  'q': {a=1; b=1; c=1; d=0; e=0; f=1; g=1; break;}
      case  'r': {a=0; b=0; c=0; d=0; e=1; f=0; g=1; break;}
      case  's': {a=1; b=0; c=1; d=1; e=0; f=1; g=1; break;}
      case  't': {a=1; b=0; c=0; d=0; e=1; f=1; g=0; break;}
      case  'u': {a=0; b=0; c=1; d=1; e=1; f=0; g=0; break;}
      case  'y': {a=0; b=1; c=0; d=0; e=1; f=1; g=1; break;}
      case  '-': {a=0; b=0; c=0; d=0; e=0; f=0; g=1; break;}
      case  '=': {a=0; b=0; c=0; d=1; e=0; f=0; g=1; break;}
      case  '.' : {a=0; b=0; c=0; d=0; e=0; f=0; g=0; p=1; break;}
      case  ',' : {a=0; b=0; c=0; d=0; e=0; f=0; g=0; p=1; break;}
      case  '!' : {a=0; b=1; c=0; d=0; e=0; f=0; g=0; p=1; break;}
      case  '\'': {a=0; b=1; c=0; d=0; e=0; f=0; g=0; p=0; break;}
      default: {a=0; b=0; c=0; d=0; e=0; f=0; g=0; break;}
    }
    this.draw_segm(a, b, c, d, e, f, g, p);
    this.value = num;
    this.point = p;
  }

  redraw() {
    this.draw(this.value, this.point);
  }

  
  clear() {
    this.draw_segm(0, 0, 0, 0, 0, 0, 0, 0);
    this.value = -1;
    this.point = false;
    this.empty = true;
  }
  
}

// ------------------------------- /one display --------------------------------------






// ------------------------------- all display --------------------------------------

class js_display {

  get height()  { 
    if ((typeof this.tbl == "undefined") || (this.tbl.length == 0) ) return 0;
    return this.tbl[0].height; 
  }

  get width ()  { 
    if ((typeof this.tbl == "undefined") || (this.tbl.length == 0) ) return 0;
    return this.tbl[0].width * this.tbl.length; 
  }
  
  getcolbyname(col){
    if (col.includes("rgb")) return col;
    // colors by name
    this.blackcol = { name: "black" , col: this.black };
    this.greencol = { name: "green" , col: this.green };
    this.redcol   = { name: "red"   , col: this.red   };
    this.bluecol  = { name: "blue"  , col: this.blue  };
    this.yellowcol= { name: "yellow", col: this.yellow};
    this.cyancol  = { name: "cyan"  , col: this.cyan  };
    var colors = [this.blackcol, this.greencol, this.redcol, this.bluecol, this.yellowcol, this.cyancol];
    for (let i=0; i < colors.length; i++) 
      if (col == colors[i].name) { col = colors[i].col; break; }
    return col;
  }

  constructor (container, cnt, size, oncol, ovrcol, backcol) {
    this.black   = "rgba(  0,   0,   0, 1)"; // std display acground color (const)
    this.green   = "rgba(  0, 255,   0, 1)"; // std segment color green  (const)
    this.red     = "rgba(255,   0,   0, 1)"; // std segment color red    (const)
    this.blue    = "rgba(  0, 100, 255, 1)"; // std segment color blue   (const)
    this.yellow  = "rgba(255, 255,   0, 1)"; // std segment color yellow (const)
    this.cyan    = "rgba(  0, 255, 255, 1)"; // std segment color yellow (const)
    
    // check colors
    if (typeof oncol   != "undefined") oncol   = this.getcolbyname(oncol  );
    if (typeof ovrcol  != "undefined") ovrcol  = this.getcolbyname(ovrcol );
    if (typeof backcol != "undefined") backcol = this.getcolbyname(backcol);

    this.removeleadingzeros = true;
    
    if (typeof cnt == "undefined") cnt = 1;
    this.tbl = [];
    // new all displays
    for (let i = 0; i < cnt; i++) {
      this.tbl[i] = new js_d7(container, size, oncol, ovrcol, backcol);
      this.tbl[i].draw(-1, 0);
    }
    // set display size
    var con = document.getElementById(container);
    con.style.width  = this.width;
    con.style.height = this.height;
  }
  

  
  // for all display color change
  color(oncol, ovrcol, backcol) {
    let ovr = false;
    let bck = false;
    if (typeof oncol   == "undefined") return -1;
    if (typeof ovrcol  != "undefined") ovr = true;
    if (typeof backcol != "undefined") bck = true;

    // check colors
    if (typeof oncol   != "undefined") oncol   = this.getcolbyname(oncol  );
    if (typeof ovrcol  != "undefined") ovrcol  = this.getcolbyname(ovrcol );
    if (typeof backcol != "undefined") backcol = this.getcolbyname(backcol);
    
    for (let i = 0; i < this.tbl.length; i++) {
      this.tbl[i].oncol   = oncol  ;
      if (ovr) this.tbl[i].ovrcol  = ovrcol ;
      if (bck) this.tbl[i].backcol = backcol;
    }
    this.redraw();
  }
 
 
 
  clear() {
    for (let i=0; i < (this.tbl.length - 1); i++) {
      this.tbl[i].clear();
    }
  }
  
  
 
  // draw fixed-point number
  draw_num(num, p) {
    let w = 1;
    let c = 0;
    let d = false;
    let minus = num < 0; 
    num = Math.abs(Math.floor(num));
        
/*    
    // draw number 0.00 (room for number)
    if (p >= 0 ) {
      let first = false;
      for (let i=(this.tbl.length - 1); i >= 0; i--) {
        first = (i == this.tbl.length - p -1);
        this.tbl[i].draw(0, first);
        if (first) break;
      }
    }
*/    
    // draw numbers
    for (let i=(this.tbl.length - 1); i >= 0; i--) {
      w *= 10;
      c = Math.floor( num % w / (w / 10 ) );
      d = (p > 0) && (p == this.tbl.length - i- 1);
      this.tbl[i].draw(c, d); 
    }
    
    // remove leading zeros
    if (this.removeleadingzeros) {
      for (let i=0; i < (this.tbl.length - 1); i++) {
        if ( (this.tbl[i].value == 0) && (this.tbl[i].point == false) ) this.tbl[i].clear(); else break;
      }
    }
    
    // minus
    if (minus) {
      let pos = this.tbl.length - 1;
      for (let i=(this.tbl.length - 1); i >= 0; i--) 
        if (!this.tbl[i].empty) pos--; else break;
        if (pos>=0) this.tbl[pos].draw('-', d);     
    }
    
    // overflow alarm
    if ( (num.toString().length + (1 * minus) ) > this.tbl.length) this.tbl[0].ovr_alarm(); 
    
  }


  // draw any number (not formated)
  draw(num) {
    //let p = 2;
    //let sn = num.toLocaleString(undefined, {useGrouping: false, minimumFractionDigits:p, maximumFractionDigits:p });
    let sn = num.toString();
    
    // overflow alarm test
    let point = 0;
    if ( sn.includes(".") || sn.includes(",") ) point = 1;
    let ovralarm = false;
    if ( (sn.length - point ) > this.tbl.length) ovralarm = true;
    if ( ovralarm ) sn = " " + sn; // shift string right
    while (sn.length -point < this.tbl.length) sn = " " + sn; // move to right
    this.draw_str(sn); // draw raw string
    if ( ovralarm ) this.tbl[0].ovr_alarm(); // show error
  }
  
  
  // draw raw string (without control)
  draw_str(s) {
    var c = '';
    var p = 0;
    var wp = 0;
    for (let i=0; i < this.tbl.length; i++) {
      if (i < s.length) c = s[i + wp]; else c = -1;
      if ( (wp == 0) && (i + 1 < s.length) ) { p = (s[i + 1] == '.') || (s[i + 1] == ','); if (p) wp = 1; }
      this.tbl[i].draw(c, p); 
      p = false;
    }
  }



  redraw() {
    for (let i=0; i < this.tbl.length; i++) { this.tbl[i].redraw(); }
  }
  
}

// ------------------------------- /all display --------------------------------------

