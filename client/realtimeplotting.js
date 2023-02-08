live_input_container = document.getElementById("live-input")
live_output_container = document.getElementById("live-output")
const submit_btn = document.getElementById('csv-submitter')
var input_arr_y= new Array(200).fill(0);
var input_arr_x= Array.from(Array(200).keys())
var output_arr_y=new Array(200).fill(0);
const csvFile = document.getElementById('csvFile')
var signal_x_csv, signal_y_csv
var pause_location = 0
var pause_bool = false
var pause_button = document.getElementById("Pause")
var restart_button = document.getElementById("Restart")
var stop_button = document.getElementById("Stop")
var live_input_x = Array.from(Array(200).keys())
var live_input_y = new Array(200).fill(0); //X
var live_output_y = new Array(200).fill(0); //Y


//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]


pause_button.addEventListener("click", function (evt){
    pause_bool = !pause_bool
    if (pause_bool == false){
        drawCsv()
        pause_button.innerHTML="Pause"
    }else pause_button.innerHTML="Continue"
})
restart_button.addEventListener("click", function (evt){
    pause_bool = false
    pause_location = 0
    live_input_x = Array.from(Array(200).keys())
    live_input_y = new Array(200).fill(0)
    live_output_y = new Array(200).fill(0);
    drawCsv()
    
})
stop_button.addEventListener("click", function (){
    pause_bool = true
    pause_location = -1
    live_input_x = Array.from(Array(200).keys())
    live_input_y = new Array(200).fill(0)
    live_output_y = new Array(200).fill(0);

    input_arr_y= new Array(200).fill(0);
    input_arr_x= Array.from(Array(200).keys())
    output_arr_y=new Array(200).fill(0);

})

function plotlyMultiLinePlot(container, data){
    return Plotly.newPlot(
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

var canvas = document.getElementById("mousepad");
canvas.addEventListener("mousemove", async function (evt) {
    var mousePos = getMousePos(canvas, evt);
    input_arr_y.push((-mousePos.y+canvas.height)/2)

    if(input_arr_y.length > 200){
        input_arr_y.shift()
 
    }
    
    plotlyMultiLinePlot(live_input_container, [{x: input_arr_x, y: input_arr_y}])
    var {zeros, poles} = filter_plane.getZerosPoles(radius)
    //add all pass
    var all_pass_a = get_a_list()
    console.log(all_pass_a)
    for (let i =0;i<all_pass_a.length;i++){
        zeros.push([1/all_pass_a[i],0])
        poles.push([all_pass_a[i],0])
    }
    const [a, b] = await get_differenceEquationCoefficients(zeros, poles)
    a[0] = 0
    var ya = output_arr_y.slice(-a.length);
    ya = ya.reverse()
    var xb = input_arr_y.slice(-b.length);
    xb = xb.reverse()
    //summision
    var new_value = 0
    for (let i=0; i<a.length; i++){
        new_value += (ya[i])*(-a[i])+(xb[i]*b[i])
    }
    output_arr_y.push(new_value)
    output_arr_y.shift()
  

    plotlyMultiLinePlot(live_output_container, [{x: input_arr_x, y: output_arr_y}])
});

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function equateLength(a, b){
    max_length = Math.max(a.length, b.length)
    for(let i = 0; i < max_length; i++){
        a[i] = i < a.length ? a[i] : 0
        b[i] = i < b.length ? b[i] : 0
    }
    return [a, b]
}

async function get_differenceEquationCoefficients(zeros, poles) {
    const {a, b} = await postData(`${API}/differenceEquationCoefficients`, {
        zeros: zeros,
        poles: poles,
    });
    equateLength(a, b);
    return [a, b]
}



/////////////////
function getCol(matrix, col) {
    var column = []
    for (var i = 0; i < matrix.length; i++) {
        column.push(matrix[i][col])
    }
    return column
}
csvFile.addEventListener('change', () => {
    pause_bool = false
    readData()
})

async function readData() {
    live_input_x = Array.from(Array(200).keys())
    live_input_y = new Array(200).fill(0); //X
    live_output_y = new Array(200).fill(0); //Y
    const input = csvFile.files[0]
    const df = await dfd.read_csv(input)
    signal_x_csv = getCol(df.values, 0)

    signal_y_csv = getCol(df.values, 1)
    drawCsv()

}

async function drawCsv(){
    for (let i = pause_location; i < signal_x_csv.length; i++){
        const {zeros, poles} = filter_plane.getZerosPoles(radius)
        const [a, b] = await get_differenceEquationCoefficients(zeros, poles) 
        a[0] = 0
     
        setTimeout(() => {
            live_input_y.push(signal_y_csv[i])
            live_input_y.shift()
            plotlyMultiLinePlot(live_input_container, [{x: live_input_x, y: live_input_y}])
            
            var ya = live_output_y.slice(-a.length);
            ya = ya.reverse()
            var xb = live_input_y.slice(-b.length);
            xb = xb.reverse()
            var new_value = 0
            for (let i=0; i<a.length; i++){ 
            new_value += (ya[i])*(-a[i])+(xb[i]*b[i])
            }
            live_output_y.push(new_value)
            live_output_y.shift()
            plotlyMultiLinePlot(live_output_container, [{x: live_input_x, y: live_output_y}])
           
            pause_location = pause_location+1
            

        }, 1);
        if (pause_bool == true){
            break
        }
        
    }
}



function* range(start, end) {
    for (let i = start; i <= end; i++) {
        yield i;
    }
}
