const filterDesignMagnitude = document.querySelector('#filter-mag-response')
const filterDesignPhase = document.querySelector('#filter-phase-response')
const allPassPhase = document.getElementById('all-pass-phase-response');
const finalPhase = document.getElementById('final-filter-phase-response');
const checkList = document.getElementById('list1');
const zero_mode_btn = document.getElementById("zero")
const pole_mode_btn = document.getElementById("pole")
const all_pass_clear_btn =  document.getElementById("clear_allpass")
const modes_btns = [zero_mode_btn, pole_mode_btn]
var list_of_a = []
checkList.classList.add('visible')

document.getElementById("mouse-pad-mode").click();
document.getElementById("design-mode").click();

document.querySelector('#listOfA').addEventListener('change', updateAllPassCoeff)
document.querySelector('#new-all-pass-coef').addEventListener('click', addNewA)


async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    return response.json()
}


async function updateFilterDesign(data) {
    data.gain = 1
    let { w, angels, magnitude } = await postData(`${API}/getFilter`, data)
    plotlyMultiLinePlot(filterDesignMagnitude, [
        { x: w, y: magnitude, line: { color: '#febc2c' } },
    ])
    plotlyMultiLinePlot(filterDesignPhase, [
        { x: w, y: angels, line: { color: '#fd413c' } },
    ])
}

checkList.getElementsByClassName('anchor')[0].onclick = function () {
    if (checkList.classList.contains('visible'))
        checkList.classList.remove('visible');
    else
        checkList.classList.add('visible');
}

function addNewA() {
    const old_li = document.querySelector('#listOfA').children

    var old_list = []
    for (let i =0; i<old_li.length;i++){
    
        old_list.push(old_li[i].children[0].checked)
    }
    var newA = document.getElementById('new-value').value
   
    if(newA > 1 || newA < -1){
        alert(`invalid ${newA} as Filter Coefficient`)
        return
    }
    if (!newA){
        alert(`please enter a value for a`)
        return
    }
    document.getElementById(
        'listOfA'
    ).innerHTML += `<li><input class = "target1" type="checkbox" data-avalue="${newA}" value="${newA}" checked/>${newA}</li>`

    const new_li = document.querySelector('#listOfA').children

    for (let i =0; i<old_li.length;i++){

        new_li[i].children[0].checked = old_list[i]
    }
    /*

    list_of_a = []
    for (let i =0; i<new_li.length;i++){
    
        
        if(new_li[i].children[0].checked == true){
            list_of_a.push(parseFloat(new_li[i].children[0].value))
        }

    }
    */


}

async function updateFilterPhase(allPassCoeff){
    const { zeros, poles } = filter_plane.getZerosPoles(radius)
    const { angels: allPassAngels } = await postData(
        'http://127.0.0.1:8080/getAllPassFilter',
        {
            a: allPassCoeff,
        }
    )
    const { w, angels: finalFilterPhase } = await postData(
        'http://127.0.0.1:8080/getFinalFilter',
        {
            zeros,
            poles,
            a: allPassCoeff,
        }
    )
    updateFilterPlotting(w, allPassAngels, finalFilterPhase)
}

function updateFilterPlotting(w, allPassAngels, finalFilterPhase){
    plotlyMultiLinePlot(allPassPhase, [{x: w, y: allPassAngels}])
    plotlyMultiLinePlot(finalPhase, [{x: w, y: finalFilterPhase}])
    plotlyMultiLinePlot(filterDesignPhase, [{x: w, y: finalFilterPhase}])
}

function plotlyMultiLinePlot(container, data){
    Plotly.newPlot(
        container,
        data,
        {
            margin: { l: 30, r: 0, b: 30, t: 0 },
            xaxis: {
                autorange: true,
                tickfont: { color: '#cccccc' },
            },
            yaxis: {
                autorange: true,
                tickfont: { color: '#cccccc' },
            },
            plot_bgcolor: '#111111',
            paper_bgcolor: '#111111',
        },
        { staticPlot: true }
    )
}

function arrayRemove(arr, value) {
    return arr.filter(function (ele) {
        return ele != value
    })
}

function updateAllPassCoeff(){
    let allPassCoeff = []
    document.querySelectorAll('.target1').forEach(item => {
        let aValue = parseFloat(item.dataset.avalue)
        let checked = item.checked
        if (checked) allPassCoeff.push(aValue)
    })
    updateFilterPhase(allPassCoeff)
}
/*
function clearCheckBoxes(){
    document.querySelectorAll('.target1').forEach(item => {
        item.checked = false;
    })
}*/

function changeMode(e){
    unit_circle_mode = modesMap[e.target.id]
    for(btn of modes_btns){
        btn.style.color = (btn !== e.target) ? "#fff" : "#febc2c";
    }
}

function openMode(evt, selectedDiv,content,links ) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName(content);
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName(links);
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(selectedDiv).style.display = "block";
    evt.currentTarget.className += " active";
  }


  //################################################################################################
const gallery_div = document.getElementById('gallery').children
var gallery = []
var gallery_status = []
for (let i=0; i<gallery.length; i++){
    gallery.push(gallery_div[i].name)
    gallery_status.push(false)
}


$("#gallery > img").click(function () {
    addA(this.name)
});


function addA(newA) {
    const old_li = document.querySelector('#listOfA').children

    var old_list = []
    for (let i =0; i<old_li.length;i++){
 
        old_list.push(old_li[i].children[0].checked)
    }
    if(newA > 1 || newA < -1){
        alert(`invalid ${newA} as Filter Coefficient`)
        return
    }
    document.getElementById(
        'listOfA'
    ).innerHTML += `<li><input class = "target1" type="checkbox" data-avalue="${newA}" value="${newA}" checked>${newA}</li>`
    
    const new_li = document.querySelector('#listOfA').children

    for (let i =0; i<old_li.length;i++){

        new_li[i].children[0].checked = old_list[i]
    }
    /*
    list_of_a = []
    for (let i =0; i<new_li.length;i++){
    
        
        if(new_li[i].children[0].checked == true){
            list_of_a.push(parseFloat(new_li[i].children[0].value))
        }

    }
*/
}

function get_a_list(){
    
    var l = document.querySelector('#listOfA').children
    var list_of_a = []
    for (let i = 0; i<l.length;i++){
      
        if(l[i].children[0].checked){
        list_of_a.push(parseFloat(l[i].children[0].value))}

    }
    return list_of_a
}

all_pass_clear_btn.addEventListener('click', function(e){
    console.log("c")
    document.getElementById('list1').innerHTML = '<span class="anchor btn">All Pass Filter Coefficients</span><ul id="listOfA" class="items"></ul>'
})

