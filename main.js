var canvas = document.getElementById("game")
var width = canvas.width
var height = canvas.height
var ctx = canvas.getContext("2d")

const tileSize = 100
let kingdom = []

let row = 0
let y = 0
let i = 1
while (y < height) {
    let x = 0
    kingdom.push([])
    while (x < width) {
        var rand = Math.random()
        let faction = 'none'
        if(rand <= 0.1)
            faction = 'red'
        if(rand >= 0.9)
            faction = 'blue'
        if(rand >= 0.8 && rand < 0.9)
            faction = 'green'
        kingdom[row].push({
            pos: i++,
            faction
        })
        x += tileSize * 2
    }
    y += tileSize / 2
    row++
}

const evenOffsets = [
    {x: 0,  y: -2},
    {x: 0,  y: -1},
    {x: 0,  y: 1},
    {x: 0,  y: 2},
    {x: -1, y: 1},
    {x: -1, y: -1}
]

const oddOffsets = [
    {x: 0,  y: -2},
    {x: 1,  y: -1},
    {x: 1,  y: 1},
    {x: 0,  y: 2},
    {x: 0, y: 1},
    {x: 0, y: -1}
]

function neighbors(x, y) {
    let offsets = y % 2 == 0 ? evenOffsets : oddOffsets

    return offsets.map(o => getTile(x, y, o.x, o.y)).filter(t => t != null)
}

function getTile(x, y, xOffset, yOffset) {
    if(x + xOffset < 0 
        || x + xOffset >= kingdom[0].length
        || y + yOffset < 0
        || y + yOffset >= kingdom.length)
        return null

    return kingdom[y + yOffset][x + xOffset]
}

function update(progress) {
    let lorule = JSON.parse(JSON.stringify(kingdom));
    lorule.forEach((row, ri) => {
        row.forEach((t, ci) => {
            let n = neighbors(ci, ri)

            let counts = {
                red: n.filter(x => x.faction == 'red').length,
                blue: n.filter(x => x.faction == 'blue').length,
                green: n.filter(x => x.faction == 'green').length
            }

            updateCells(t, counts)
            
        })
    })
    kingdom = lorule
}

function updateCells(cell, counts) {
    if(cell.faction == 'red' && counts.red >= 2)
        return cell.faction = 'none'

    if((cell.faction == 'none'  || cell.faction == 'green' ) && counts.red >= 2)
        return cell.faction = 'red'

    if(cell.faction == 'none' && counts.green >= 1 && counts.blue >= 1)
        return cell.faction = 'green'

    if(cell.faction == 'none' && counts.green >= 1 && counts.blue >= 1)
        return cell.faction = 'green'
}

const sum = (a, b) => a + b

function draw() {
    ctx.clearRect(0, 0, width, height)

    kingdom.forEach((row, ri) => {
        let isOffset = ri % 2 != 0
        let xOffset = isOffset ? 75 : 0
        row.forEach((t, ci) => {
            let x = (ci + 1) * 150 + xOffset - 50
            let y = ri * 44 + 50
            drawHexagon(x, y)
            if(t.faction != 'none')
            {
                ctx.fillStyle = t.faction
                ctx.fill()
            }
            ctx.fillStyle = 'black'
            ctx.font = '14px serif';
            ctx.fillText(`${ci},${ri}|${t.pos}`, x, y);
        })
    })
}

function loop(timestamp) {
    var progress = timestamp - lastRender
    if(lastRender != 0)
        update(progress)
    
    draw()

    lastRender = timestamp
    //window.requestAnimationFrame(loop)
}

var lastRender = 0
//window.requestAnimationFrame(loop)


const hexAngle = 2 * Math.PI / 6;
const hexWidth = tileSize / 2;
function drawHexagon(x, y) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
        ctx.lineTo(x + hexWidth * Math.cos(hexAngle * i), y + hexWidth * Math.sin(hexAngle * i));
    }
    ctx.closePath();
    ctx.stroke();
}

loop()