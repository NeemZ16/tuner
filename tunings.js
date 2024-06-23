// preset tunings
let tunings = {
    "Standard": { 6: "E2", 5: "A2", 4: "D3", 3: "G3", 2: "B3", 1: "E4", "type": "original" },
    "Open D": { 6: "D2", 5: "A2", 4: "D3", 3: "F#3", 2: "A3", 1: "D4", "type": "original" },
    "Open C": { 6: "C2", 5: "G2", 4: "C3", 3: "G3", 2: "C4", 1: "E4", "type": "original" },
    "Open G": { 6: "D2", 5: "G2", 4: "D3", 3: "G3", 2: "B3", 1: "D4", "type": "original" },
    "Drop D": { 6: "D2", 5: "A2", 4: "D3", 3: "G3", 2: "B3", 1: "E4", "type": "original" }
};

const str1 = document.querySelector("#str1");
const str2 = document.querySelector("#str2");
const str3 = document.querySelector("#str3");
const str4 = document.querySelector("#str4");
const str5 = document.querySelector("#str5");
const str6 = document.querySelector("#str6");
const strBtns = [str1, str2, str3, str4, str5, str6];

strBtns.forEach(btn => btn.addEventListener("click", handleSelectString));

const customTable = document.querySelector(".custom-table");
const t_up = document.querySelector("#t-up");
const t_down = document.querySelector("#t-down");
const resetCustom = document.querySelector("#reset-custom");
const saveBtn = document.querySelector("#save-custom");
const input = document.querySelector("#tuning-name");
const save_msg = document.querySelector("#save-msg");

function escape_html(text) {
    escaped = text.replaceAll("&", "&amp;");
    escaped = escaped.replaceAll(">", "&gt;");
    escaped = escaped.replaceAll('"', "&quot;");
    escaped = escaped.replaceAll("'", "&#39");
    escaped = escaped.replaceAll("<", "&lt;");

    return escaped;
}

function rescape_html(text) {
    // undo and redo escape html for rendered text
    unescaped = text.replaceAll("&amp;", "&");
    unescaped = unescaped.replaceAll("&gt;", ">");
    unescaped = unescaped.replaceAll("&quot;", '"');
    unescaped = unescaped.replaceAll("&#39", "'");
    unescaped = unescaped.replaceAll("&lt;", "<");

    return escape_html(unescaped);
}

function getKeyFromBtn(btn) {
    let key = rescape_html(btn.innerHTML);
    const closeBtnHtml = `&lt;button title=&quot;delete tuning&quot; class=&quot;delete-btn&quot; id=&quot;delete_${btn.id}&quot;&gt;x&lt;/button&gt;`;
    const closeBtnShownHtml = `&lt;button title=&quot;delete tuning&quot; class=&quot;delete-btn show-del&quot; id=&quot;delete_${btn.id}&quot;&gt;x&lt;/button&gt;`;
    
    if (key.includes(closeBtnHtml) || key.includes(closeBtnShownHtml)) {
        key = key.replace(closeBtnHtml, "");
        key = key.replace(closeBtnShownHtml, "");
    }
    
    key = rescape_html(key);
    return key;
}

function handleSelectTuning(event) {
    if (event.target.id.startsWith("delete_")) { return; }
    save_msg.innerHTML = "";
    if (listening) { stopTuner(); }
    customTable.classList.add("hidden");

    // highlight preset on click
    const newActive = event.target;
    const currActive = document.querySelector(".tunings .active");
    if (currActive) { currActive.classList.remove("active"); }
    newActive.classList.add("active");

    // hide current delete button for custom tunings
    const currDelete = document.querySelector(".show-del");
    if (currDelete) { currDelete.classList.remove("show-del"); }

    // change str btns
    const tuning = tunings[getKeyFromBtn(newActive)];
    str6.innerHTML = tuning[6];
    str5.innerHTML = tuning[5];
    str4.innerHTML = tuning[4];
    str3.innerHTML = tuning[3];
    str2.innerHTML = tuning[2];
    str1.innerHTML = tuning[1];

    // show delete if custom
    if (tuning["type"] === "custom") {
        const correspondingDelete = document.querySelector(`#delete_${newActive.id}`);
        correspondingDelete.classList.add("show-del");
    }
}

function handleSelectString(event) {
    if (!listening) {
        return
    }

    const newActive = event.target;
    const currActive = document.querySelector(".str-btns .active");
    if (currActive) { currActive.classList.remove("active"); }
    newActive.classList.add("active");

    target.innerHTML = newActive.innerHTML;
}

function showCustom(event) {
    if (listening) { stopTuner(); }
    const currDelete = document.querySelector(".show-del");
    if (currDelete) { currDelete.classList.remove("show-del"); }

    // show custom and scroll into view
    const currActive = document.querySelector(".tunings .active");
    if (currActive) { currActive.classList.remove("active"); }
    event.target.classList.add("active");
    customTable.classList.remove("hidden");
    customTable.scrollIntoView({ behavior: "smooth" });
    setCustomStrings();
}

function setCustomStrings() {
    for (let i = 0; i < 6; i++) {
        strBtns[i].innerHTML = document.querySelector(`td button.s${i + 1}.active`).innerHTML;
    }
}

function handleSelectCustom(event) {
    save_msg.innerHTML = "";
    if (listening) { stopTuner(); }

    const group = event.target.classList[0];
    const currActive = document.querySelector(`td button.${group}.active`);
    if (currActive) { currActive.classList.remove("active"); }
    event.target.classList.add("active");

    const row = event.target.getAttribute("row");
    if (row === "0") {
        t_up.disabled = true;
    } else if (row === "8") {
        t_down.disabled = true;
    } else {
        // check all active and if none in first or last enable proper button
        if (t_down.disabled || t_up.disabled) {
            const actives = document.querySelectorAll("td button.active");
            let lastRow = false, firstRow = false;
            actives.forEach(active => {
                const r = active.getAttribute("row");
                if (r === "0") {
                    firstRow = true;
                } else if (r === "8") {
                    lastRow = true;
                }
            })
            if (!firstRow) { t_up.disabled = false; }
            if (!lastRow) { t_down.disabled = false; }
        }
    }
    // set corresponding string
    const groups = ["s1", "s2", "s3", "s4", "s5", "s6"];
    strBtns[groups.indexOf(group)].innerHTML = event.target.innerHTML;
}

resetCustom.addEventListener('click', () => {
    save_msg.innerHTML = "";
    if (listening) { stopTuner(); }

    const def = document.querySelectorAll("[row='4']");
    const currActive = document.querySelectorAll("td button.active");

    currActive.forEach(curr => curr.classList.remove("active"));
    def.forEach(def => def.classList.add("active"));
    setCustomStrings();
    t_down.disabled = false;
    t_up.disabled = false;
});

t_up.addEventListener('click', () => {
    save_msg.innerHTML = "";
    const currActive = document.querySelectorAll("td button.active");
    if (t_down.disabled = true) { t_down.disabled = false; }

    currActive.forEach(curr => {
        if (curr.getAttribute("row") == "1") {
            t_up.disabled = true;
        }
        if (curr.getAttribute("row") != 0) {
            curr.classList.remove("active");
            const newActive = document.querySelector(`.${curr.classList[0]}[row="${parseInt(curr.getAttribute("row")) - 1}"]`);
            newActive.classList.add("active");
            setCustomStrings();
        }
    })
});

t_down.addEventListener('click', () => {
    save_msg.innerHTML = "";
    const currActive = document.querySelectorAll("td button.active");
    if (t_up.disabled = true) { t_up.disabled = false; }

    currActive.forEach(curr => {
        if (curr.getAttribute("row") == "7") {
            t_down.disabled = true;
        }

        if (curr.getAttribute("row") != "8") {
            curr.classList.remove("active");
            const newActive = document.querySelector(`.${curr.classList[0]}[row="${parseInt(curr.getAttribute("row")) + 1}"]`);
            newActive.classList.add("active");
            setCustomStrings();
        }
    })
});

input.addEventListener('input', () => {
    if (input.value.trim().length === 0) {
        saveBtn.disabled = true;
        return
    }
    saveBtn.disabled = false;
})

saveBtn.addEventListener('click', () => {
    const title = escape_html(input.value.trim());
    let tuning = { "type": "custom" }
    for (let i = 6; i > 0; i--) {
        tuning[i] = document.querySelector(`button.s${i}.active`).innerHTML;
    }

    // check for duplicate tuning
    let exists = false;
    Object.entries(tunings).forEach(([key, value]) => {
        const { ["type"]: _, ...compTuning } = tuning;
        const { ["type"]: __, ...compValue } = value;

        if (JSON.stringify(compTuning) === JSON.stringify(compValue)) {
            // show error message
            console.log(compTuning, compValue, key);
            const gotoID = getIDFromKey(key);
            console.log("gotoID:", gotoID);
            save_msg.innerHTML = `Tuning already exists: <button id="go-to-tuning" onclick=selectTuning("${gotoID}")>${key}</button> tuning`;
            exists = true;
        } else if (title.toLowerCase() === key.toLowerCase()) {
            save_msg.innerHTML = "Name already exists";
            exists = true;
        }
    })

    if (exists) { return }

    // save to storage
    let custom_tunings = {};
    const stored = localStorage.getItem("custom-tunings");
    if (stored) {
        custom_tunings = JSON.parse(stored);
    }

    custom_tunings[title] = tuning;

    localStorage.setItem("custom-tunings", JSON.stringify(custom_tunings));
    customTable.classList.add("hidden");
    loadTunings();
    selectTuning(getIDFromKey(title));
});

function loadTunings() {
    const stored = JSON.parse(localStorage.getItem("custom-tunings"));
    if (stored) {
        Object.entries(stored).forEach(([key, value]) => {
            tunings[key] = value;
        })
    }

    // generate buttons for custom tunings
    const tDiv = document.querySelector(".tunings");
    tDiv.innerHTML = "";
    const tunings_keys = Object.keys(tunings);

    for (let i = 0; i < tunings_keys.length; i++) {
        const key = tunings_keys[i];
        const idFragment = "tuning_" + i.toString();

        const tuningBtn = document.createElement("button");
        tuningBtn.innerHTML = key;
        tuningBtn.setAttribute("title", "select tuning");
        tuningBtn.setAttribute("type", tunings[key]["type"]);
        tuningBtn.id = idFragment;
        tuningBtn.addEventListener("click", handleSelectTuning);

        if (key === "Standard") { tuningBtn.classList.add("active"); }

        if (tunings[key]["type"] === "custom") {
            // add delete button INSIDE button html so it is the child and then position later
            const delBtn = document.createElement("button");
            delBtn.innerHTML = "x";
            delBtn.setAttribute("title", "delete tuning");
            delBtn.classList.add("delete-btn");
            delBtn.id = `delete_${idFragment}`;
            delBtn.addEventListener("click", deleteTuning);
            tuningBtn.appendChild(delBtn);
        }

        tDiv.appendChild(tuningBtn);
    }

    const addCustom = document.createElement("button");
    addCustom.setAttribute("title", "add custom tuning");
    addCustom.innerHTML = "+ Custom";
    addCustom.id = "add-tuning";
    addCustom.addEventListener('click', showCustom);
    tDiv.appendChild(addCustom);
}

function deleteTuning(event) {
    // add delete functionality to delete buttons
    const toDeleteId = `${event.target.id.substring("delete_".length)}`;

    // remove from local storage and DOM
    const toDeleteBtn = document.querySelector(`#${toDeleteId}`);
    const key = getKeyFromBtn(toDeleteBtn);

    let custom_tunings = {};
    const stored = localStorage.getItem("custom-tunings");
    if (stored) {
        custom_tunings = JSON.parse(stored);
    }

    delete tunings[key];
    delete custom_tunings[key];
    localStorage.setItem("custom-tunings", JSON.stringify(custom_tunings));
    toDeleteBtn.remove();
    
    // select standard tuning
    selectTuning("tuning_0");
}

function selectTuning(id) {
    const toClick = document.querySelector(`#${id}`).click();
}

function getIDFromKey(key) {
    const btns = document.querySelectorAll("button[title='select tuning']");
    for (let i=0; i < btns.length; i++) {
        if (key === getKeyFromBtn(btns[i])) {
            return btns[i].id.toString();
        }
    }
}