window.onload = register

var timeout_dict = {};

var color_dict = {
  "p1" : "#DC143C",
  "p2" : "#6A5ACD",
  "p3" : "#2E8B57",
  "p4" : "#FFA500"
};

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

  var elem = document.querySelector("#reset-all")
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

  var reset_elem = document.querySelector("#open-settings")
  reset_elem.onmousedown = function () {
    fadein(reset_elem)
  }
  reset_elem.addEventListener("touchstart", (event) => {
    event.preventDefault()
    fadein(reset_elem)
  }, false)
  reset_elem.onmouseup = function () {
    fadeout(reset_elem)
    toggle_settings("in")
  }
  reset_elem.addEventListener("touchend", (event) => {
    event.preventDefault()
    fadeout(reset_elem)
    toggle_settings("in")
  }, false)

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
  var elem_to_update
  elem_to_update = document.getElementById(player + "-text"); 
  player_life = elem_to_update.innerHTML

  if (elem.classList.contains(tax) || elem.classList.contains(turn)) {
    player_life = player_life.split("<br>")[1]
  }

  delta = (direction == "increase" ? 1 : -1);
  if (value !== null && value !== undefined) {
    delta = delta * value
    elem.classList.add("modified")
  }

  player_life = parseInt(player_life) + delta
  var new_inner_html
  if (elem.classList.contains(tax)) {
    if (player_life < 0) player_life = 0 // commander tax can't be less than 0
    new_inner_html = "Tax<br/>" + player_life;
  } else if (elem.classList.contains(turn)) {
    if (player_life < 1) player_life = 1 // a turn can't be less than 1
    new_inner_html = "Turn<br/>" + player_life;
  } else if (elem.classList.contains("cmdr-dmg")) {
    // restrict commander damage range to 0-21
    change = true
    if (player_life <= 0) {
      document.getElementById(player + "-container").classList.add("idle")
    }
    if (player_life < 0) {
      player_life = 0
      console.log("player " + player)
      // document.getElementById(player + "-container").classList.add("idle")
      change = false
      //need to re-add the dark class
  }
    if (player_life > 21) {
      player_life = 21
      change = false
    }
    new_inner_html = player_life;
    //also need to adjust normal life at the same time
    console.log(player)
    if (change) {
      const regex = "p[0-9]"
      const found = player.match(regex)[0]
      matching_player_elem = document.getElementById(found + "-text")
      matching_player_elem.innerHTML = parseInt(matching_player_elem.innerHTML) - delta
    }
    // matching_player_life_html = document.getElementById(matching_player_life).innerHTML
  } else {
    new_inner_html = player_life;
  }
  elem_to_update.innerHTML = new_inner_html
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
  document.querySelectorAll(".tax-text").forEach(function(elem) {
    elem.innerHTML = "Tax<br/>0"
  });
  document.querySelectorAll(".life-main").forEach(function(elem) {
    elem.innerHTML = "40"
  });
  document.querySelectorAll(".life-cmdr-dmg").forEach(function(elem) {
    elem.innerHTML = "0"
  });
  document.querySelectorAll(".idle-reset").forEach(function(elem) {
    elem.classList.remove("idle-reset")
    elem.classList.add("idle")
  });
  
  document.getElementById("turn-text").innerHTML = "Turn<br/>1"
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