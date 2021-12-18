
fetch("./traits.json")
    .then(response => response.json())
        .then(data => {
            populate_traits_modal(data);
        });

fetch("./weapons.json")
    .then(response => response.json())
        .then(data => {
            populate_weapons_modal(data);
        });

let modal_trait_info = {
    "trait_name": "None",
    "points": "-",
    "description": "-",
    "cost": "-"
}
let n_traits = 0;
let trait_btn_num = 0;
let trait_edit_num = -1;
let trait_template = document.getElementById("trait-accordion-");
let active_traits = {};

function populate_traits_modal(data)
{
    function populate_modal_trait_stats(trait_name, stats_json){
        // Change the trait description
        document.getElementById('trait-description').innerText = stats_json['description'];

        // Change the cost field
        let trait_cost = document.getElementById('trait-cost')
        let fist_image = trait_cost.lastChild;
        document.getElementById('trait-cost').innerText = stats_json['cost'];
        trait_cost.appendChild(fist_image);

        // Change the trait name field
        document.getElementById('trait-name').innerText = trait_name;

        // Change the trait points field
        document.getElementById('trait-points').innerText = "Points: " + stats_json['points'];
    }

    // Modal "Add Trait" button
    let modal_add_trait = document.getElementById("modal-add-trait");
    let add_trait = document.getElementById("add-trait");
    let traits_block = document.getElementById("traits-block");
    modal_add_trait.addEventListener("click", () => {
        if (modal_trait_info["trait_name"] != "None")
        {
            if(trait_edit_num < 0){
                create_accordion(trait_template, "trait", traits_block, trait_btn_num);
                console.log(trait_btn_num)
                edit_trait(trait_btn_num);

                let trait_delete = document.getElementById("trait-delete-"+trait_btn_num.toString());
                let trait_edit = document.getElementById("trait-edit-"+trait_btn_num.toString());
                let trait_accordion = document.getElementById("trait-accordion-"+trait_btn_num.toString());
                // Add an event listener for the delete button.
                trait_delete.addEventListener("click", () => {
                    traits_block.removeChild(trait_accordion);
                    n_traits--;
                    add_trait.removeAttribute("disabled");

                    delete active_traits[trait_accordion.id.match(/\d+$/)[0]];
                    get_traits(data);
                    calculate_points();
                });
    
                // Add an event listener for the edit button.
                trait_edit.addEventListener("click", () => {
                    trait_edit_num = trait_edit.id.match(/\d+$/)[0];
                    let ename = active_traits[trait_edit_num.toString()]["trait_name"];
                    modal_trait_info = {"trait_name": ename, 
                                        "points": data[ename]["points"], 
                                        "description": data[ename]["description"], 
                                        "cost": data[ename]["cost"]};

                    populate_modal_trait_stats(modal_trait_info["trait_name"], modal_trait_info);
                    // Get values from active_traits json
                    let existing_trait_names = [];
                    for(let i in active_traits) {
                        if (active_traits[i]["trait_name"] != ename)
                            existing_trait_names.push(active_traits[i]["trait_name"]);
                    }
                    populate_trait_dropdown(existing_trait_names);
                    
                });
                active_traits[trait_btn_num.toString()] = modal_trait_info;

                n_traits++;
                trait_btn_num++;
                console.log(trait_btn_num)
                if(n_traits == 3)
                {
                    add_trait.setAttribute("disabled", "disabled");
                }
            }
            else{
                edit_trait(trait_edit_num);
                active_traits[trait_edit_num.toString()] = modal_trait_info;
                trait_edit_num = -1;
            }
            console.log(active_traits);
            get_traits(data);
            calculate_points();
        }
    });


    // Add trait button
    let dropdown = document.getElementById("traits-dropdown")
    add_trait.addEventListener("click", () => {
        modal_trait_info = {"trait_name": "None", "points": "-", "description": "-", "cost": "-"};
        populate_modal_trait_stats(modal_trait_info["trait_name"], modal_trait_info);

        // Get values from active_traits json
        let existing_trait_names = [];
        for(let i in active_traits) existing_trait_names.push(active_traits[i]["trait_name"]);
        populate_trait_dropdown(existing_trait_names);

    });

    function populate_trait_dropdown(hide_list){
        // Delete all traits from dropdown
        while(dropdown.firstChild) 
            dropdown.removeChild(dropdown.firstChild);

        // Add new traits to dropdown
        for(let i in data) {
            // Only add traits that haven't already been selected.
            if(hide_list.indexOf(i) < 0){
                let list_item_child = document.createElement("div");
                list_item_child.classList.add("dropdown-item");
                list_item_child.innerText = i + " (" + data[i]["points"] + ")";
                let list_item = document.createElement("li");
                list_item.appendChild(list_item_child);
        
                list_item.onmouseover = function(event) {
                    populate_modal_trait_stats(i, data[i]);
                }
                list_item.onmouseout = function(event) {
                    populate_modal_trait_stats(modal_trait_info["trait_name"], modal_trait_info);
                }
                list_item.onclick = function(event) {
                    modal_trait_info["trait_name"] = i;
                    modal_trait_info["cost"] = data[i]["cost"];
                    modal_trait_info["points"] = data[i]["points"];
                    modal_trait_info["description"] = data[i]["description"];
                }
        
                dropdown.appendChild(list_item);
            }
        }
    }
    // Cancel button
    let cancel_button = document.getElementById("trait-modal-close");
    cancel_button.addEventListener("click", ()=>{ trait_edit_num = -1; });

}


function edit_trait(id){
    // I have seen behavior where the id is an old deleted one, when adding a trait.
    document.getElementById("trait-name-"+id.toString()).innerText = modal_trait_info["trait_name"];
    document.getElementById("trait-desc-"+id.toString()).innerText = modal_trait_info["description"];
    let trait_cost = document.getElementById("trait-cost-"+id.toString())
    let fist_image = trait_cost.lastChild;
    trait_cost.innerText = modal_trait_info["cost"];
    trait_cost.appendChild(fist_image);
}




let modal_weapon_info = {
    "special": "",
    "weapon_name": "None",
    "points": "0",
    "melee": "-",
    "short": "-",
    "medium": "-",
    "long": "-"
}


let n_weapons = 0;
let weapon_btn_num = 0;
let weapon_edit_num = -1;
let weapon_template = document.getElementById("weapon-accordion-");
let active_weapons = {};

let blue_dice = document.createElement("div");
blue_dice.style.backgroundColor = "#0d6efd";
blue_dice.style.width = "40px";
blue_dice.style.height = "40px";
blue_dice.style.borderRadius = "10%";
blue_dice.style.display = "inline-block";
blue_dice.style.marginRight = "8px";

let green_dice = blue_dice.cloneNode(true);
green_dice.style.backgroundColor = "#198754";

function populate_weapons_modal(data)
{
    let dropdown = document.getElementById("weapons-dropdown");
    let modal_weapon_name = document.getElementById("weapon-name");
    let modal_weapon_points = document.getElementById("weapon-points");
    let modal_weapon_desc = document.getElementById("weapon-description");
    let melee_targs = document.getElementById("melee-targs");
    let short_targs = document.getElementById("short-targs");
    let medium_targs = document.getElementById("medium-targs");
    let long_targs = document.getElementById("long-targs");

    let modal_weapon_desc_header = document.getElementById("weapon-desc-header");
    let modal_upgrade_table = document.getElementById("modal-upgrade-table");
    let modal_target_table = document.getElementById("modal-target-table");

    // Function for changing the weapon stats on the modal
    // This is done whenever user mouses over, mouses off, loads new modal, etc.
    function populate_modal_weapon_stats(weapon_name, stats_json){
        if(weapon_name == "None"){
            modal_weapon_desc_header.setAttribute("hidden", "hidden");
            modal_upgrade_table.setAttribute("hidden", "hidden");
            modal_target_table.setAttribute("hidden", "hidden");
        }
        else{
            modal_weapon_desc_header.removeAttribute("hidden");
            modal_upgrade_table.removeAttribute("hidden");
            modal_target_table.removeAttribute("hidden");

        }
        if(stats_json["special"])
            modal_weapon_desc_header.removeAttribute("hidden");
        else
            modal_weapon_desc_header.setAttribute("hidden", "hidden");

        modal_weapon_desc.innerText = stats_json["special"];
        modal_weapon_name.innerText = weapon_name;
        modal_weapon_points.innerText = "Points: " + stats_json["points"];
        melee_targs.innerText = stats_json["melee"];
        short_targs.innerText = stats_json["short"];
        medium_targs.innerText = stats_json["medium"];
        long_targs.innerText = stats_json["long"];
    }
    populate_modal_weapon_stats(modal_weapon_info["weapon_name"], modal_weapon_info);

    for(let i in data)
    {
        let list_item_child = document.createElement("div");
        list_item_child.classList.add("dropdown-item");
        list_item_child.innerText = i + " (" + data[i]["points"] + ")";
        let list_item = document.createElement("li");
        list_item.appendChild(list_item_child);

        list_item.onmouseover = function(event) {
            populate_modal_weapon_stats(i, data[i]);
        }

        list_item.onmouseout = function(event) {
            populate_modal_weapon_stats(modal_weapon_info["weapon_name"], modal_weapon_info);
        }

        list_item.onclick = function(event) {
            modal_weapon_info["special"] = data[i]["special"]
            modal_weapon_info["weapon_name"] = i;
            modal_weapon_info["points"] = data[i]["points"];
            modal_weapon_info["melee"] = data[i]["melee"];
            modal_weapon_info["short"] = data[i]["short"];
            modal_weapon_info["medium"] = data[i]["medium"];
            modal_weapon_info["long"] = data[i]["long"];
        }

        dropdown.appendChild(list_item);
    }

    // (MODAL) Add weapon button
    let modal_add_weapon = document.getElementById("modal-add-weapon");
    let weapons_block = document.getElementById("weapons-block");
    let add_weapon = document.getElementById("add-weapon");

    modal_add_weapon.addEventListener("click", () => {
        if (modal_weapon_info["weapon_name"] != "None") {
            if(weapon_edit_num < 0) {
                //create_weapon(weapons_block, weapon_btn_num);
                create_accordion(weapon_template, "weapon", weapons_block, weapon_btn_num);
                edit_weapon(weapon_btn_num);
                let weapon_delete = document.getElementById("weapon-delete-"+weapon_btn_num.toString());
                let weapon_edit = document.getElementById("weapon-edit-"+weapon_btn_num.toString());
                let weapon_accordion = document.getElementById("weapon-accordion-"+weapon_btn_num.toString());
                // Add an event listener for the delete button.
                weapon_delete.addEventListener("click", () => {
                    weapons_block.removeChild(weapon_accordion);
                    n_weapons--;
                    add_weapon.removeAttribute("disabled");

                    delete active_weapons[weapon_accordion.id.match(/\d+$/)[0]];
                    get_weapons(data);
                    calculate_points();
                });
        
                // Add an event listener for the edit button.
                weapon_edit.addEventListener("click", () => {
                    weapon_edit_num = weapon_edit.id.match(/\d+$/)[0];
                    let ename = active_weapons[weapon_edit_num.toString()]["weapon_name"];
                    modal_weapon_info = {
                        "special": data[ename]["special"],
                        "weapon_name": ename,
                        "points": data[ename]["points"],
                        "melee": data[ename]["melee"],
                        "short": data[ename]["short"],
                        "medium": data[ename]["medium"],
                        "long": data[ename]["long"]
                    }
                    counters = active_weapons[weapon_edit_num.toString()]["counters"];

                    populate_modal_weapon_stats(modal_weapon_info["weapon_name"], modal_weapon_info);
                    color_dice("melee");
                    color_dice("ranged");
                });
                active_weapons[weapon_btn_num.toString()] = modal_weapon_info;
                active_weapons[weapon_btn_num.toString()]["counters"] = counters;
    
    
                n_weapons++;
                weapon_btn_num++;
                if(n_weapons == 2)
                {
                    add_weapon.setAttribute("disabled", "disabled");
                }
            }
            else
            {
                active_weapons[weapon_edit_num.toString()] = modal_weapon_info;
                active_weapons[weapon_edit_num.toString()]["counters"] = counters;
                edit_weapon(weapon_edit_num);
                weapon_edit_num = -1;
            }
        }
        get_weapons(data);
        calculate_points();
    });

    // Add weapon button
    add_weapon.addEventListener("click", () => {
        modal_weapon_info = {"special": "", "weapon_name": "None", "points": "0", "melee": "-", "short": "-", "medium": "-", "long": "-" };
        counters = {"melee-b": 0, "melee-g": 0, "ranged-b": 0, "ranged-g": 0};
        populate_modal_weapon_stats(modal_weapon_info["weapon_name"], modal_weapon_info);
        color_dice("melee");
        color_dice("ranged");
    });

    // Cancel button
    let cancel_button = document.getElementById("weapon-modal-close");
    cancel_button.addEventListener("click", ()=>{ weapon_edit_num = -1; });
}

function create_accordion(template, object_string, html_element, id){
    let new_object = template.cloneNode(true);
    new_object.classList.remove("d-none");
    // Change the ID for clone and all its child elements (with IDs)
    let id_elements = [new_object, ...new_object.querySelectorAll("[id]")];
    id_elements.forEach((e) => {
        e.id += id.toString();
    });
    html_element.appendChild(new_object);
    // Define collapse target for accordion
    let object_acc_btn = document.getElementById(object_string+"-acc-btn-"+id.toString());
    object_acc_btn.setAttribute("data-bs-target", "#"+object_string+"-collapse-" + id.toString());
    // Define edit button to toggel modal
    let edit_button = document.getElementById(object_string+"-edit-"+id.toString());
    edit_button.setAttribute("data-bs-toggle","modal")
    edit_button.setAttribute("data-bs-target","#"+object_string+"s")
}

function edit_weapon(id){
    // Change weapon name
    document.getElementById("weapon-name-"+id.toString()).innerText = modal_weapon_info["weapon_name"];
    // Change targetting table
    document.getElementById("melee-targs-"+id.toString()).innerText = modal_weapon_info["melee"];
    document.getElementById("short-targs-"+id.toString()).innerText = modal_weapon_info["short"];
    document.getElementById("medium-targs-"+id.toString()).innerText = modal_weapon_info["medium"];
    document.getElementById("long-targs-"+id.toString()).innerText = modal_weapon_info["long"];
    // Change upgrade blocks
    let melee_dice_div = document.getElementById("melee-dice-div-"+id.toString())
    let ranged_dice_div = document.getElementById("ranged-dice-div-"+id.toString())
    // Remove all existing dice
    while(melee_dice_div.firstChild) 
        melee_dice_div.removeChild(melee_dice_div.firstChild);
    while(ranged_dice_div.firstChild) 
        ranged_dice_div.removeChild(ranged_dice_div.firstChild);

    // Hide upgrades if there are none
    if(counters["melee-b"] + counters["melee-g"] == 0)
        document.getElementById("melee-upgrades-"+id.toString()).classList.add("d-none", "d-none");
    else
        document.getElementById("melee-upgrades-"+id.toString()).classList.remove("d-none");

    if(counters["ranged-b"] + counters["ranged-g"] == 0)
        document.getElementById("ranged-upgrades-"+id.toString()).classList.add("d-none", "d-none");
    else
        document.getElementById("ranged-upgrades-"+id.toString()).classList.remove("d-none");
    
    if(counters["melee-b"] + counters["melee-g"] + 
       counters["ranged-b"] + counters["ranged-g"] == 0){
        document.getElementById("upgrade-table-"+id.toString()).classList.add("d-none", "d-none");
    }
    // If upgrades exist, add them
    else{
        document.getElementById("upgrade-table-"+id.toString()).classList.remove("d-none");
        // Add melee dice
        for(let i = 0; i < counters["melee-b"]; i++)
            melee_dice_div.appendChild(blue_dice.cloneNode(true));
        
        for(let i = 0; i < counters["melee-g"]; i++)
            melee_dice_div.appendChild(green_dice.cloneNode(true));
    
        // Add ranged dice
        for(let i = 0; i < counters["ranged-b"]; i++)
            ranged_dice_div.appendChild(blue_dice.cloneNode(true));
        
        for(let i = 0; i < counters["ranged-g"]; i++)
            ranged_dice_div.appendChild(green_dice.cloneNode(true));
    }

    // Change weapon description
    if (modal_weapon_info["special"])
        document.getElementById("weapon-desc-"+id.toString()).innerText = modal_weapon_info["special"];
    else
        document.getElementById("weapon-desc-block-"+id.toString()).classList.add("d-none","d-none");

}



let counters = {"melee-b": 0, "melee-g": 0, "ranged-b": 0, "ranged-g": 0};

let upgrade_color = ["b", "g"]
let button_type = ["plus", "minus"]
let upgrade_type = ["melee", "ranged"]

function color_dice(type) {
    let dice_colors = "b".repeat(counters[type+"-b"]) + 
                      "g".repeat(counters[type+"-g"]);
    dice_colors += "w".repeat(3 - dice_colors.length);

    for(let i = 0; i < 3; i++)
    {
        let dice = document.getElementById(type+"-dice-"+i.toString())
        switch(dice_colors[i]) {
            case "b":
                dice.style.backgroundColor = "#0d6efd";
                break;
            case "g":
                dice.style.backgroundColor = "#198754";
                break;
            default:
                dice.style.backgroundColor = "white";

        }
    }
    // Change the input form to have the correct values.
    document.getElementById(type+"-upgr-b").value = counters[type+"-b"];
    document.getElementById(type+"-upgr-g").value = counters[type+"-g"];
}


for(let i=0; i<2; i++){
    for(let j=0; j<2; j++){
        let type = upgrade_type[i];
        let color = upgrade_color[j];

        let counter_input = document.getElementById(type+"-upgr-"+color)

        counter_input.addEventListener("keypress", (evt) => {
            let allowable_inputs = "0123";
            input_val = String.fromCharCode(evt.which);
            if(!allowable_inputs.includes(input_val)) {evt.preventDefault(); return;}

            if(counters[type+"-"+upgrade_color[1-j]] + parseInt(input_val) > 3){
                evt.preventDefault(); return;
            }
            counters[type+"-"+color] = parseInt(input_val);
            color_dice(type);
        });

        counter_input.addEventListener("focusout", () => {
            counter_input.value = counters[type+"-"+color];
        });

        let minus_button = document.getElementById(type+"-upgr-"+color+"-minus")
        minus_button.addEventListener("click", () => {
            if(counters[type+"-b"] + counters[type+"-g"] == 0) {
                return;
            }
            if(counters[type+"-"+color] == 0) {
                return;
            }
            counters[type+"-"+color]--;
            counter_input.value=counters[type+"-"+color];
            color_dice(type);
        })

        let plus_button = document.getElementById(type+"-upgr-"+color+"-plus")
        plus_button.addEventListener("click", () => {
            if(counters[type+"-b"] + counters[type+"-g"] == 3) {
                return;
            }
            if(counters[type+"-"+color] == 3) {
                return;
            }
            counters[type+"-"+color]++;
            counter_input.value=counters[type+"-"+color];
            color_dice(type);
        })
    }
}
 
			function isNumberKey(evt)
			{
				let charCode = (evt.which) ? evt.which : evt.keyCode;
				if (charCode != 46 && charCode > 31 
				&& (charCode < 48 || charCode > 57))
				return false;
				return true;
			}  
			
			
			function isNumericKey(evt)
			{
				var charCode = (evt.which) ? evt.which : evt.keyCode;
				if (charCode != 46 && charCode > 31 
				&& (charCode < 48 || charCode > 57))
				return true;
				return false;
			} 

let armor_upgrades = [0,0,0]
let armor_selector = document.getElementById("armor-selector");
armor_selector.addEventListener("change", function() 
{
    let n_upgrades = armor_upgrades[0] + armor_upgrades[1] + armor_upgrades[2];
    let armor_value = parseInt(this.value);
    points_json["armor"] = armor_value;

    // If there are more upgrades than armor value, turn off upgrades
    let i = 2;
    while(n_upgrades > armor_value && i >= 0) {
        if(armor_upgrades[i] == 1){
            let armor_upgrade = document.getElementById("armor-upgrade-"+i.toString());
            armor_upgrade.style.backgroundColor = "white";
            armor_upgrades[i] = 0;
            n_upgrades--;
        }
        i--;
    }
    points_json["armor-upgrades"] = n_upgrades;
    calculate_points();
});

for(let i = 0; i < 3; i++)
{
    let armor_upgrade = document.getElementById("armor-upgrade-"+i.toString());
    armor_upgrade.addEventListener("click", ()=>{
        let armor_value = parseInt(armor_selector.value);
        let n_upgrades = armor_upgrades[0] + armor_upgrades[1] + armor_upgrades[2];
        if(armor_upgrades[i] == 0) {
            if(n_upgrades < armor_value){
                armor_upgrade.style.backgroundColor = "#dc3545";
                armor_upgrades[i] = 1;
                n_upgrades++;
            }
            else {
                popoverList[i].enable()
                popoverList[i].show()
                setTimeout(function() {
                    popoverList[i].hide();
                }, 2500);
                popoverList[i].disable()
            }
        }
        else{
            armor_upgrade.style.backgroundColor = "white";
            armor_upgrades[i] = 0;
        }
        points_json["armor-upgrades"] = n_upgrades;
        calculate_points();
    });
}





let weapon_type =  {"Shield":"Melee",
                    "Pistol and Hand Weapon":"Ranged",
                    "Polearm":"Melee",
                    "Hand Axe":"Melee",
                    "Hammer":"Melee",
                    "Club":"Melee",
                    "bow":"Ranged",
                    "Crossbow":"Ranged",
                    "Great Weapon":"Melee",
                    "Great Hammer":"Melee",
                    "Great Sword":"Melee",
                    "Improvised Weapon":"Melee",
                    "Rifle":"Ranged",
                    "Sword":"Melee",
                    "Shotgun":"Ranged",
                    "SMG":"Ranged", 
                    "Sniper Rifle":"Ranged",
                    "Pistol":"Ranged",
                    "Hand Weapon":"Melee",
                    "Axe":"Melee",
                    "Spear":"Melee",
                    "Knife":"Melee", 
                    "Assault Rifle":"Ranged"};


let points_json = {
    "type": "",
    "range": 4,
    "melee": 4,
    "aptitude": 4,
    "trait1": 0,
    "trait2": 0,
    "trait3": 0,
    "armor": 0,
    "armor-upgrades": 0,
    "weapon1": 0,
    "weapon1-m-upgrades": 0,
    "weapon1-r-upgrades": 0,
    "weapon2": 0,
    "weapon2-m-upgrades": 0,
    "weapon2-r-upgrades": 0,
    "plot-armor": 0
}
let armor_upgrade_points = {
    0: 0,
    1: 2,
    2: 4,
    3: 6
}

let upgrade_points = {
    0: 0,
    1: 1,
    2: 3,
    3: 5
}

let points_by_weapon_type = {
    "Ranged":
    {
        "range": {4: 0, 5: 4, 6: 7, 7: 9, 8: 11 },
        "melee": {4: 0, 5: 2, 6: 4, 7: 7, 8: 9 },
        "aptitude": {4: 0, 5: 4, 6: 7, 7: 9, 8: 11 },
        "armor": {1: 0, 2: 3, 3: 6}
    },

    "Melee":
    {
        "range": {4: 0, 5: 0, 6: 0, 7: 0, 8: 0 },
        "melee": {4: 0, 5: 2, 6: 4, 7: 7, 8: 9 },
        "aptitude": {4: 0, 5: 4, 6: 7, 7: 9, 8: 11 },
        "armor": {1: 0, 2: 3, 3: 6}
    }
}

var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
});
for(let i = 0; i < 3; i++) popoverList[i].disable();


// Plot Armor Checkbox
let plot_armor_cb = document.getElementById("plot-armor-cb")
plot_armor_cb.addEventListener("change", function()
{
    if (this.checked)
        points_json["plot-armor"] = 1;
    else
        points_json["plot-armor"] = 0;
    
    calculate_points();
});

// Stat selectors
let stat_types = ["melee", "range", "aptitude"];
for(let i = 0; i < 3; i++)
{
    let stat_type = stat_types[i];
    let selector = document.getElementById(stat_type+"-selector");

    selector.addEventListener("change", function() 
    {
        points_json[stat_type] = parseInt(this.value);
        calculate_points();
    });

}






function get_weapons()
{
    // Reset the weapons related points before reassigning poitns
    points_json["weapon1"] = 0
    points_json["weapon1-upgrades"] = 0
    points_json["weapon2"] = 0
    points_json["weapon2-upgrades"] = 0
    points_json["type"] = ""

    let weapon_num = 1;
    let w_type = "";
    for(i in active_weapons)
    {
        let num_m_upgrs = active_weapons[i]["counters"]["melee-b"] + active_weapons[i]["counters"]["melee-g"];
        let num_r_upgrs = active_weapons[i]["counters"]["ranged-b"] + active_weapons[i]["counters"]["ranged-g"];

        if (w_type != "Ranged") w_type = weapon_type[active_weapons[i]["weapon_name"]];

        points_json["weapon"+weapon_num.toString()] = active_weapons[i]["points"];
        points_json["weapon"+weapon_num.toString()+"-m-upgrades"] = num_m_upgrs;
        points_json["weapon"+weapon_num.toString()+"-r-upgrades"] = num_r_upgrs;
        weapon_num++;
    }
    points_json["type"] = w_type;

    console.log(points_json);
}


function get_traits(data)
{
    points_json["trait1"] = 0;
    points_json["trait2"] = 0;
    points_json["trait3"] = 0;
    let children = document.getElementById("traits-block").childNodes;
    let trait_num = 1;
    for(let i = 0; i < children.length; i++) {
        if(children[i].id) {
            let id_number = children[i].id.match(/\d+$/)[0];
            let t_name = document.getElementById("trait-name-"+id_number.toString()).innerText;
            points_json["trait"+trait_num.toString()] = data[t_name]["points"];
            trait_num++;
        }
    }
}

function calculate_points(){
    let points = 10;

    // Add points for stats
    let weapon_type = points_json["type"];
    if(weapon_type){
        console.log(weapon_type)
        let aptitude = points_json["aptitude"];
        let melee = points_json["melee"];
        let range = points_json["range"];
        let armor = points_json["armor"];
    
        points += points_by_weapon_type[weapon_type]["aptitude"][aptitude];
        points += points_by_weapon_type[weapon_type]["range"][range];
        points += points_by_weapon_type[weapon_type]["melee"][melee];
        points += points_by_weapon_type[weapon_type]["armor"][armor];
    }

    // Add points from traits
    points += points_json["trait1"];
    points += points_json["trait2"];
    points += points_json["trait3"];

    // Add points from weapons
    points += points_json["weapon1"];
    points += points_json["weapon2"];

    // Add points from weapon upgrades
    points += upgrade_points[points_json["weapon1-m-upgrades"]];
    points += upgrade_points[points_json["weapon1-r-upgrades"]];
    points += upgrade_points[points_json["weapon2-m-upgrades"]];
    points += upgrade_points[points_json["weapon2-r-upgrades"]];

    // Add points from armor upgrades
    points += armor_upgrade_points[points_json["armor-upgrades"]];


    // Add points from plot armor
    points += points_json["plot-armor"] * 10;



    document.getElementById("points").innerText = points.toString() + " Points";

}
calculate_points();

let file_input = document.getElementById("file");
file_input.addEventListener("change", function(event){
    let portrait = document.getElementById("character-portrait");
    if(event.target.files.length){
        portrait.src = URL.createObjectURL(event.target.files[0]);
    }
});