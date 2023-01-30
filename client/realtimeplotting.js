/*start b3bsa*/
live_input_container = document.getElementById("live-input")
live_output_container = document.getElementById("live-output")
var input_arr_y= new Array(200).fill(0);
var input_arr_x= Array.from(Array(200).keys())
console.log(input_arr_y)
console.log(input_arr_x)
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
canvas.addEventListener("mousemove", function (evt) {
    var mousePos = getMousePos(canvas, evt);
    input_arr_y.push(mousePos.y)
    input_arr_x.push(input_arr_x[input_arr_x.length-1]+1)
    if(input_arr_y.length > 300){
        input_arr_y.shift()
        input_arr_x.shift()
    }
    console.log(input_arr_y.length + ',' + input_arr_x.length)
    plotlyMultiLinePlot(live_input_container, [{x: input_arr_x, y: input_arr_y}])

    
    plotlyMultiLinePlot(live_output_container, [{x: input_arr_x, y: input_arr_y}])
}, false);

//Get Mouse Position
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
/*end b3bsa*/

async function get_differenceEquationCoefficients(zeros, poles) {
    const {a, b} = await postData(`${API}/differenceEquationCoefficients`, {
        zeros: zeros,
        poles: poles,
    });
    equateLength(a, b);
    return [a, b]
}



