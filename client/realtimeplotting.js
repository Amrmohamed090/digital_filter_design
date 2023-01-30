/*start b3bsa*/
live_input_container = document.getElementById("live-input")
live_output_container = document.getElementById("live-output")
var input_arr_y= new Array(200).fill(0);
var input_arr_x= Array.from(Array(200).keys())
var output_arr_y=new Array(200).fill(0);

//=> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]



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
    input_arr_y.push(-mousePos.y+canvas.height)

    if(input_arr_y.length > 200){
        input_arr_y.shift()
 
    }
    
    plotlyMultiLinePlot(live_input_container, [{x: input_arr_x, y: input_arr_y}])
    const {zeros, poles} = filter_plane.getZerosPoles(radius)
    console.log({zeros, poles})
  
    const [a, b] = await get_differenceEquationCoefficients(zeros, poles)
    
    var ya = output_arr_y.slice(-a.length+1);
    ya = ya.reverse()
    var xb = input_arr_y.slice(-b.length+1);
    xb = xb.reverse()
    console.log({a,b})
    //summision
    var new_value = 0
    for (let i=0; i<ya.length; i++){
        if (i == 0){
            new_value += (xb[i]*b[i])
        }
        else{
            new_value += (ya[i])*(-a[i])+(xb[i]*b[i])
        }
   
    
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
/*end b3bsa*/
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



