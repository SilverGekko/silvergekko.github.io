window.onload = register
var portrait;
if (window.matchMedia("(orientation: portrait)").matches) {
  var portrait = true
} else if (window.matchMedia("(orientation: landscape)").matches) {
  var portrait = false
} else {
  console.log("Halt and catch fire.")
}
console.log(portrait)

var timeout_dict = {};

var color_dict = {
  "p1" : "#DC143C",
  "p2" : "#6A5ACD",
  "p3" : "#2E8B57",
  "p4" : "#FFA500"
};

var totals = {
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
  /* Turn #  */
  "turn" : 1
};

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

function register() {
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

  var elems = document.querySelectorAll(".reset-all")
  elems.forEach((elem) => {
    elem.onmousedown = function () {
      fadein(elem)
    }
    elem.addEventListener("touchstart", (event) => {
      event.preventDefault()
      fadein(elem)
    }, false)
    elem.onmouseup = function () {
      fadeout(elem)
      reset_all()
    }
    elem.addEventListener("touchend", (event) => {
      event.preventDefault()
      fadeout(elem)
      reset_all()
    }, false)
  });
  //end reset-all
  var settings_elems = document.querySelectorAll(".open-settings")
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

  var settings_off = document.querySelector("#blank-out")
  settings_off.onmouseup = function () {
    toggle_settings("color")
  }
  settings_off.addEventListener("touchend", (event) => {
    event.preventDefault()
    toggle_settings("color")
  }, false)

  for (const [key, value] of Object.entries(color_dict)) {
    document.querySelectorAll("#" + key + "-color").forEach(function(elem) {
      elem.defaultValue = color_dict[key]
    });
  }

}

function start_plus_ten_timer(elem) {
  return setTimeout(function () { incdec(elem, 10) }, 600)
}

function start_dec_by_one_timer(elem) {
  return setTimeout(function () { incdec(elem, -1) }, 400)
}

// function update_totals(elem, new_total) {
//   if (elem.classList.contains(tax)) {
//     taxes[player] = new_total
//   } else if (elem.classList.contains(turn)) {
//     // player_life = player_life.split("<br>")[1]
//     turns = new_total
//   } else if (elem.classList.contains(cmdr_dmg)) {
//     cmdr_dmgs[player] = new_total
//   } else {
//     life_totals[player] = new_total
//   }
// }

function update_totals() {
  for (var key in totals) {
    for (const orientation of ["-P", "-L"]) {
      if(totals.hasOwnProperty(key)) {
        //var value = totals[key]
        elem = document.getElementById(key + "-text" + orientation)
        var new_inner_html;
        //there is probably a better way to do this
        if (elem.classList.contains("tax-text")) {
          if (portrait)
            elem.innerHTML = "Tax: " +  totals[key]
          else
            elem.innerHTML = "Tax<br/>" + totals[key]
        } else if (elem.classList.contains("turn-text")) {
          if (portrait)
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
}

const mql = window.matchMedia("(orientation: portrait)");
mql.onchange = (e) => {
  portrait = e.matches
  update_totals()
}

function incdec(elem, value) {
  if (elem.classList.contains("modified")) {
    elem.classList.remove("modified")
    if (timeout_dict[elem] !== null && timeout_dict[elem] !== undefined) {
      clearTimeout(timeoutid)
    }
    return
  }
  id_split = elem.id.split("-")
  player = id_split[0]
  direction = id_split[1]
  var player_life;
  var tax = "tax"
  var turn = "turn"
  var cmdr_dmg = "cmdr-dmg"
  var elem_to_update
  elem_to_update = document.getElementById(player + "-text");

  // player_life = elem_to_update.innerHTML

  console.log("player: ", player)
  player_life = totals[player]
  // if (elem.classList.contains(tax)) {
  //   player_life = taxes[player]
  //   console.log("contains tax")
  // } else if (elem.classList.contains(turn)) {
  //   // player_life = player_life.split("<br>")[1]
  //   player_life = turns
  //   console.log("contains turn")
  // } else if (elem.classList.contains(cmdr_dmg)) {
  //   player_life = cmdr_dmgs[player]
  //   console.log("contains cmdr_dmg")
  // } else {
  //   player_life = life_totals[player]
  // }


  // if (elem.classList.contains(tax) || elem.classList.contains(turn)) {
  //   player_life = player_life.split("<br>")[1]
  // }

  delta = (direction == "increase" ? 1 : -1);
  if (value !== null && value !== undefined) {
    delta = delta * value
    elem.classList.add("modified")
  }

  console.log("player life0: ", player_life)
  player_life = parseInt(player_life) + delta
  console.log("player life1: ", player_life)
  var new_inner_html
  if (elem.classList.contains(tax)) {
    if (player_life < 0) player_life = 0 // commander tax can't be less than 0
    if (portrait) {
      new_inner_html = "Tax: " + player_life;
    } else {
      new_inner_html = "Tax<br/>" + player_life;
    }
  } else if (elem.classList.contains(turn)) {
    if (player_life < 1) player_life = 1 // a turn can't be less than 1
    if (portrait) {
      new_inner_html = "Turn: " + player_life;
    } else {
      new_inner_html = "Turn<br/>" + player_life;
    }
  } else if (elem.classList.contains(cmdr_dmg)) {
    // restrict commander damage range to 0-21
    change = true
    if (player_life <= 0) {
      document.getElementById(player + "-container").classList.add("idle")
    }
    if (player_life < 0) {
      player_life = 0
      change = false
      //need to re-add the dark class
  }
    if (player_life > 21) {
      player_life = 21
      change = false
    }
    new_inner_html = player_life;
    //also need to adjust normal life at the same time
    if (change) {
      const regex = "p[0-9]"
      const found = player.match(regex)[0]
      matching_player_elem = document.getElementById(found + "-text")
      console.log("found: ", found)
      // matching_player_elem.innerHTML = parseInt(matching_player_elem.innerHTML) - delta
      // life_totals[found] -= delta;
      totals[found] -= delta
      // matching_player_elem.innerHTML = life_totals[found]
    }
  } else {
    // new_inner_html = player_life;
  }
  totals[player] = player_life

  update_totals()

  // elem_to_update.innerHTML = new_inner_html
  elem.classList.remove("dark")

  print_totals()
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
  totals = {
    "p1" : 40,
    "p2" : 40,
    "p3" : 40,
    "p4" : 40,
    "p1p2" : 0,
    "p1p3" : 0,
    "p1p4" : 0,
    "p2p1" : 0,
    "p2p3" : 0,
    "p2p4" : 0,
    "p3p1" : 0,
    "p3p2" : 0,
    "p3p4" : 0,
    "p4p1" : 0,
    "p4p2" : 0,
    "p4p3" : 0,
    "p1p1" : 0,
    "p2p2" : 0,
    "p3p3" : 0,
    "p4p4" : 0,
    "turn" : 1
  }
  update_totals()
  // document.querySelectorAll(".tax-text").forEach(function(elem) {
  //   elem.innerHTML = "Tax<br/>0"
  // });
  // document.querySelectorAll(".life-main").forEach(function(elem) {
  //   elem.innerHTML = "40"
  // });
  // document.querySelectorAll(".life-cmdr-dmg").forEach(function(elem) {
  //   elem.innerHTML = "0"
  // });
  // document.querySelectorAll(".idle-reset").forEach(function(elem) {
  //   elem.classList.remove("idle-reset")
  //   elem.classList.add("idle")
  // });
  
  // document.getElementById("turn-text").innerHTML = "Turn<br/>1"
}

function toggle_settings(set_colors) {
  if (set_colors == "color") {
    for (let i = 1; i <= 4; i++) {
      for (const [key, value] of Object.entries(color_dict)) {
        document.querySelectorAll(".color" + i).forEach(function(elem) {
          var color = document.getElementById("p" + i + "-color").value
          elem.style.backgroundColor = color;
        });
      }
    }
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