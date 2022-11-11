window.onload = register

//used for adding breaks in landscape text boxes
let screen_orientation = "portrait"

//used to clear the dark "you pressed here" icons
let timeout_dict = {}

let color_dict = {}

/*
1 => 3
2 => 1
3 => 4
4 => 2
*/
// "p2" : "#DC143C",
// "p4" : "#6A5ACD",
// "p1" : "#2E8B57",
// "p3" : "#FFA500"

let totals = {}

let checkboxes = {}

let in_hard_reset = false
let cancel_normal_reset = false

function update_colors() {
  for (let i = 1; i <= 4; i++) {
    for (const [key, value] of Object.entries(color_dict)) {
      document.querySelectorAll(".color" + i).forEach(function(elem) {
        const color = document.getElementById("p" + i + "-color").value
        // color_dict["p" + i] = color
        elem.style.backgroundColor = color;
        // http://alienryderflex.com/hsp.html
        // brightness = sqrt( .299 R2 + .587 G2 + .114 B2 )
        const rgb = color.match(/([^#]{1,2})/g)
        const red = parseInt(rgb[0], 16)
        const green = parseInt(rgb[1], 16)
        const blue = parseInt(rgb[2], 16)
        const brightness = Math.sqrt(
          (0.299 * red * red) + (0.587 * green * green) + (0.114 * (blue * blue))
        );
        if (brightness < 35) {
          elem.classList.remove("font-color-dark")
          elem.classList.add("font-color-light")
        } else {
          elem.classList.add("font-color-dark")
          elem.classList.remove("font-color-light")
        }
      });
    }
  }
}

function default_colors() {
  color_dict = {
    "p1" : "#DC143C",
    "p2" : "#6A5ACD",
    "p3" : "#2E8B57",
    "p4" : "#FFA500"
  }

  checkboxes = {
    "p1" : false,
    "p2" : false,
    "p3" : false,
    "p4" : false
  }
}

function init_life_and_settings() {
  totals = {
    /* Main Life  */
    "p1" : 40,
    "p2" : 40,
    "p3" : 40,
    "p4" : 40,
    /* Commander Damage  */
    "p1p2" : 0,
    "p1p3" : 0,
    "p1p4" : 0,
    ///////////
    "p2p1" : 0,
    "p2p3" : 0,
    "p2p4" : 0,
    ///////////
    "p3p1" : 0,
    "p3p2" : 0,
    "p3p4" : 0,
    ///////////
    "p4p1" : 0,
    "p4p2" : 0,
    "p4p3" : 0,
    /* Tax  */
    "p1p1" : 0,
    "p2p2" : 0,
    "p3p3" : 0,
    "p4p4" : 0,
    /*Partner*/
    "p1p2a" : 0,
    "p1p3a" : 0,
    "p1p4a" : 0,
    ////////////
    "p2p1a" : 0,
    "p2p3a" : 0,
    "p2p4a" : 0,
    ////////////
    "p3p1a" : 0,
    "p3p2a" : 0,
    "p3p4a" : 0,
    ////////////
    "p4p1a" : 0,
    "p4p2a" : 0,
    "p4p3a" : 0,
    /* Turn # */
    "turn" : 1
  }
  update_settings_order()
}

function clear_timeouts() {
  for (const [key, value] of Object.entries(timeout_dict)) {
    clearTimeout(value)
  }
}

function process_partners(elem) {
  const player_id = elem.id
  const id = player_id.split('partners')[0]
  const ids = ["p1", "p2", "p3", "p4"]
  //toggle the commander damage from one commander to two
  for (const item of ids) {
    if (item == id) continue;
    if (elem.checked) {
      document.querySelectorAll("#" + item + id + "a-container").forEach(con => {
        con.classList.remove("display-none")
      })
      document.querySelectorAll("#" + item + id + "-container").forEach(con => {
        con.classList.add("partner-separator")
      })
    } else {
      document.querySelectorAll("#" + item + id + "a-container").forEach(con => {
        con.classList.add("display-none")
      })
      document.querySelectorAll("#" + item + id + "-container").forEach(con => {
        con.classList.remove("partner-separator")
      })
    }
    checkboxes[id] = elem.checked
  }
}

function print_totals() {
  console.log("totals: ")
  console.log(JSON.stringify(totals, undefined, 2))
}

function remove_idle(elem) {
  if (elem.parentElement.classList.contains("idle")) {
    elem.parentElement.classList.remove("idle")
    elem.parentElement.classList.add("idle-reset")
  }
}

function update_settings_order() {
  if (screen_orientation == "landscape") {
    document.getElementById("settings-swap").innerHTML = 
     '<div class="holder"><input type="checkbox" onchange="process_partners(this);" class="big-color left big-box" id="p1partners" name="p1partners"><input type="color" class="big-color right" id="p1-color"></input></div>\
      <div class="holder"><input type="color" class="big-color left" id="p2-color"></input><input type="checkbox" onchange="process_partners(this);" class="big-color right big-box" id="p2partners" name="p2partners"></div>\
      <div class="holder"><input type="checkbox" onchange="process_partners(this);" class="big-color left big-box" id="p3partners" name="p3partners"><input type="color" class="big-color right" id="p3-color"></input></div>\
      <div class="holder"><input type="color" class="big-color left" id="p4-color"></input><input type="checkbox" onchange="process_partners(this);" class="big-color right big-box" id="p4partners" name="p4partners"></div>'
  } else {
    document.getElementById("settings-swap").innerHTML = 
    '<div class="holder"><input type="checkbox" onchange="process_partners(this);" class="big-color left big-box" id="p3partners" name="p3partners"></input><input type="checkbox" onchange="process_partners(this);" class="big-color right big-box" id="p1partners" name="p1partners"></div>\
    <div class="holder"><input type="color" class="big-color left" id="p3-color"></input><input type="color" class="big-color right" id="p1-color"></input></div>\
    <div class="holder"><input type="color" class="big-color left" id="p4-color"></input><input type="color" class="big-color right" id="p2-color"></input></div>\
    <div class="holder"><input type="checkbox" onchange="process_partners(this);" class="big-color left big-box" id="p4partners" name="p4partners"><input type="checkbox" onchange="process_partners(this);" class="big-color right big-box" id="p2partners" name="p2partners"></div>'
  }
  for (const [key, value] of Object.entries(color_dict)) {
    document.querySelector("#" + key + "-color").defaultValue = color_dict[key]
  }
  for (const [key, value] of Object.entries(checkboxes)) {
    document.getElementById(key + "partners").checked = checkboxes[value]
  }
}

function register() {
  hard_reset(null, true)

  const mql = window.matchMedia("(orientation: portrait)");
  function orientation_change() {
    screen_orientation = mql.matches ? "portrait" : "landscape"
    update_totals()
    update_settings_order()
  }
  mql.onchange = orientation_change
  orientation_change()

  document.querySelectorAll(".button-span").forEach(function(elem) {
    elem.onmousedown = function () {
      timeoutid = start_plus_ten_timer(elem)
      fadein(elem)
      timeout_dict[elem] = timeoutid
      remove_idle(elem)
    }
    elem.addEventListener("touchstart", (event) => {
      event.preventDefault()
      timeoutid = start_plus_ten_timer(elem);
      fadein(elem);
      timeout_dict[elem] = timeoutid
    }, false);
    elem.onmouseup = function () {
      incdec(elem)
      clearTimeout(timeout_dict[elem])
    }
    elem.addEventListener("touchend", (event) => {
      event.preventDefault()
      incdec(elem);
      fadeout(elem);
      clearTimeout(timeout_dict[elem])
      if (elem.classList.contains("idle"))
        elem.classList.remove(idle)
        remove_idle(elem)
    }, false);
  });

  document.querySelectorAll(".count-by-one").forEach(function(elem) {
    elem.onmousedown = function () {
      timeoutid = start_dec_by_one_timer(elem)
      fadein(elem)
      timeout_dict[elem] = timeoutid
    }
    elem.addEventListener("touchstart", (event) => {
      event.preventDefault()
      timeoutid = start_dec_by_one_timer(elem);
      fadein(elem);
      timeout_dict[elem] = timeoutid
    }, false);
    elem.onmouseup = function () {
      incdec(elem)
      clearTimeout(timeout_dict[elem])
    }
    elem.addEventListener("touchend", (event) => {
      event.preventDefault()
      incdec(elem);
      fadeout(elem);
      clearTimeout(timeout_dict[elem])
    }, false);
  });

  function mousedown_reset(elem) {
    timeoutid = start_hard_reset_timer(elem)
    fadein(elem)
    timeout_dict[elem] = timeoutid
  }

  function mouseup_reset(elem) {
    if (in_hard_reset) {
      in_hard_reset = false
    }
    fadeout(elem);
    if (cancel_normal_reset) {
      cancel_normal_reset = false
      return
    }
    hard_reset(elem, false)
    clearTimeout(timeout_dict[elem])
  }

  document.querySelectorAll(".reset-all").forEach((elem) => {
    elem.onmousedown = function () {
      mousedown_reset(elem)
    }
    elem.addEventListener("touchstart", (event) => {
      event.preventDefault()
      mousedown_reset(elem)
    }, false);
    elem.onmouseup = function () {
      mouseup_reset(elem)
    }
    elem.addEventListener("touchend", (event) => {
      event.preventDefault()
      mouseup_reset(elem)
    }, false);
  });
  //end reset-all

  let settings_elems = document.querySelectorAll(".open-settings")
  settings_elems.forEach((elem) => {
    elem.onmousedown = function () {
      fadein(elem)
    }
    elem.addEventListener("touchstart", (event) => {
      event.preventDefault()
      fadein(elem)
    }, false)
    elem.onmouseup = function () {
      fadeout(elem)
      toggle_settings("in")
    }
    elem.addEventListener("touchend", (event) => {
      event.preventDefault()
      fadeout(elem)
      toggle_settings("in")
    }, false)
  });

  let settings_off = document.querySelector("#blank-out")
  settings_off.onmouseup = function () {
    toggle_settings("color")
  }
  settings_off.addEventListener("touchend", (event) => {
    event.preventDefault()
    toggle_settings("color")
  }, false)

  update_colors()
}

function start_plus_ten_timer(elem) {
  return setTimeout(function () { incdec(elem, 10) }, 600)
}

function start_dec_by_one_timer(elem) {
  return setTimeout(function () { incdec(elem, -1) }, 400)
}

function start_hard_reset_timer(elem) {
  console.log("hard reset scheduled")
  in_hard_reset = true
  return setTimeout(function () { 
    console.log("hard reset CALLED")
    hard_reset(elem, true)
  }, 800)
}

function update_totals() {
  // print_totals()
  for (const key in totals) {
    for (const orientation of ["-P", "-L"]) {
      if(!totals.hasOwnProperty(key)) continue
      elem = document.getElementById(key + "-text" + orientation)
      //there is probably a better way to do this
      if (elem == null) continue
      if (elem.classList.contains("tax-text")) {
        if (screen_orientation == "portrait")
          elem.innerHTML = "Tax: " +  totals[key]
        else
          elem.innerHTML = "Tax<br/>" + totals[key]
      } else if (elem.classList.contains("turn-text")) {
        if (screen_orientation == "portrait")
          elem.innerHTML = "Turn: " +  totals[key]
        else
          elem.innerHTML = "Turn<br/>" + totals[key]
      } else {
        elem.innerHTML = totals[key]
      }
      if (elem.classList.contains("life-cmdr-dmg") && totals[key] == 0 && !elem.parentElement.classList.contains("idle")) {
        elem.parentElement.classList.add("idle")
      }
      if (elem.classList.contains("life-cmdr-dmg") && totals[key] != 0 && elem.parentElement.classList.contains("idle")) {
        elem.parentElement.classList.remove("idle")
      }
    }
  }
}

function incdec(elem, value) {
  if (elem.classList.contains("modified")) {
    elem.classList.remove("modified")
    return
  }
  let id_split = elem.id.split("-")
  const player_id = id_split[0]
  let val_to_update = totals[player_id]

  delta = (id_split[1] == "increase" ? 1 : -1);
  if (value !== null && value !== undefined) {
    delta *= value
    elem.classList.add("modified")
  }

  val_to_update += delta
  if (elem.classList.contains("tax")) {
    if (val_to_update < 0) val_to_update = 0 // commander tax can't be less than 0
  } else if (elem.classList.contains("turn")) {
    if (val_to_update < 1) val_to_update = 1 // a turn can't be less than 1
  } else if (elem.classList.contains("cmdr-dmg")) {
    // restrict commander damage range to 0-21
    let change_main_life = true
    if (val_to_update <= 0) {
      //need to re-add the idle class to make the commander damage boxes dark again
      document.querySelectorAll("#" + player_id + "-container").forEach(node => {
        node.classList.add("idle")
      })
    }
    if (val_to_update < 0) {
      val_to_update = 0
      change_main_life = false
    }
    if (val_to_update > 21) {
      val_to_update = 21
      change_main_life = false
    }
    //also need to adjust normal life at the same time
    if (change_main_life) totals[player_id.match("p[0-9]")[0]] -= delta
  }

  totals[player_id] = val_to_update
  update_totals()
  elem.classList.remove("dark")
}

function fadein(elem) {
  elem.classList.add("dark")
}

function fadeout(elem) {
  elem.classList.remove("dark")
}

function onLongPress(element, callback) {
  let timer;
  element.addEventListener('touchstart', () => { 
    timer = setTimeout(() => {
      timer = null;
      callback();
    }, 500);
  });

  function cancel() {
    clearTimeout(timer);
  }

  element.addEventListener('touchend', cancel);
  element.addEventListener('touchmove', cancel);
}

function reset_all() {
  init_life_and_settings()
  update_totals()
}

function fake_reset(elem, reset_colors) {
  console.log("fake reset called with args:")
  console.log("in_reset: ", in_hard_reset)
  console.log(elem, reset_colors)
  if (in_hard_reset) {
    cancel_normal_reset = true
    fadeout(elem)
  }
  in_hard_reset = false
}

function hard_reset(elem, reset_colors) {
  console.log("in_hard_reset: ", in_hard_reset);
  console.log("cancel_normal_reset: ", cancel_normal_reset);
  if (in_hard_reset) {
    cancel_normal_reset = true
    fadeout(elem)
  }
  reset_all()
  for (const checkbox in ["p1partners", "p2partners", "p2partners", "p4partners"]) {
    const partner = document.getElementById(checkbox)
    if (partner != null) {
      partner.checked = false
    }
  }
  if (reset_colors == true) {
    default_colors()
    update_colors()
    for (const item of ["p1", "p2", "p3", "p4"]) {
      for (const id of ["p1", "p2", "p3", "p4"]) {
        if (id == item) continue
        const con = id + item
        document.querySelectorAll("#" + con + "a-container").forEach(a_con => {
          a_con.classList.add("display-none")
        })
        document.querySelectorAll("#" + con + "-container").forEach(normal => {
          normal.classList.remove("middle-margin-right")
        })
      }
    }
  }
  clear_timeouts()
}

function toggle_settings(set_colors) {
  if (set_colors == "color") {
    update_colors()
  }

  if (document.querySelector("#settings").classList.contains("hidden"))
    document.querySelector("#settings").classList.remove("hidden")
  if (document.querySelector("#blank-out").classList.contains("hidden"))
    document.querySelector("#blank-out").classList.remove("hidden")
  document.querySelector("#settings").classList.toggle("fade-out-settings");
  document.querySelector("#blank-out").classList.toggle("fade-out-bg");
  document.querySelector("#settings").classList.toggle("fade-in-settings");
  document.querySelector("#blank-out").classList.toggle("fade-in-bg");
}
