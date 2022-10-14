const playerBoard = document.querySelector('#playerTable')
playerBoard.classList.add('selectable')
const enemyBoard = document.querySelector('#enemyTable')
const body = document.querySelector('body')
const board = document.querySelector('.container')
const playerTable = playerBoard.appendChild(document.createElement('table'))
const enemyTable = enemyBoard.appendChild(document.createElement('table'))
playerTable.classList.add('playerZone')
enemyTable.classList.add('enemyZone')
const tr = playerTable.appendChild(document.createElement('tr'))
const shipContainer = document.querySelector('#ships')
const shipTable = shipContainer.appendChild(document.createElement('table'))
shipTable.classList.add('selectable')
const shipTr = shipTable.appendChild(document.createElement('tr'))
const output = document.querySelector('#output')
const letters=['A','B','C','D','E','F','G','H','I','J','K','L']
let miss={'p':[],'e':[]}
let hit={'p':[],'e':[]} // change it to the deep copy 
const gamePhases = {0:'Menu',1:'placement', 2:'play' ,3:'gameover'}
let phase = 'newgame'
let trgClass, trgInner
let arrFilled=[]
let turn = true
let t =''
// Ship status are: idle, placed, destroyed(destroyed phase comes with when the location array got empty due to move onto hit bar)
let playerShips=
{
'Carrier'   :{
size:5,
location:[],
status:'idle'
},

'Battleship':{
size:4,
location:[],
status:'idle'},

'Cruiser'   :{
size:3,
location:[],
status:'idle'},

'Submarine' :{
size:3,
location:[],
status:'idle'},

'Destroyer' :{
size:2,
location:[],
status:'idle'}
}
let enemyShip = {
    'Carrier'   :{
    size:5,
    location:[],
    status:'idle'
    },
    
    'Battleship':{
    size:4,
    location:[],
    status:'idle'},
    
    'Cruiser'   :{
    size:3,
    location:[],
    status:'idle'},
    
    'Submarine' :{
    size:3,
    location:[],
    status:'idle'},
    
    'Destroyer' :{
    size:2,
    location:[],
    status:'idle'}
    }
function drawTable(place)
{   let zone='p'
    if(place.classList!='playerZone'){zone='e'}
    place.innerHTML=''
    for (let i = 0; i < 11; i++) 
    {
        const tr = place.appendChild(document.createElement('tr'))
        
        for (let t = 0; t < 11; t++) 
        {
            if (i==0 && t>0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=(t);continue}
            else if (t==0 && i>0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=(letters[i-1]);continue}
            else if (i==0 && t==0){const td = tr.appendChild(document.createElement('td'));td.innerHTML=('');continue}
            // for making 1010 instead of 010010 on class
            let pos = (i<10 ? '0'+(i).toString():(i).toString())+(t<10 ? '0'+(t).toString():(t).toString())
            const td = tr.appendChild(document.createElement('td'))
            // td.innerHTML=(i+'th row '+t+'th column')
            td.classList.add(pos,'cell',zone)
            td.setAttribute('id',zone+pos)
        }    
}}

function clean()
{
    Object.keys(playerShips).forEach(e => {
        playerShips[e].location=[]
        playerShips[e].status='idle'
    });
}
function drawShips(playerShips)
{   
    shipTr.innerHTML=''
    console.log('I have drawn the ships')
    for(let s in playerShips)
    {
        const tdShipname = shipTr.appendChild(document.createElement('td'))
        tdShipname.innerHTML=`${s}`
        tdShipname.classList.add('ship')
        tdShipname.setAttribute('id',s)
    }
    
}
newGame()
function newGame()
{
    drawTable(playerTable)
    drawTable(enemyTable)
    drawShips(playerShips)
    phase='menu'
    // shipSelector()
    clean()
    boardSelector()
    arrFilled=[]
}

function boardSelector()
{   let tempArr=[]
    board.addEventListener('click',function(e)
    {   
         target= e.target
        if(target.classList.contains('disabled')){return}
        if (phase=='newgame'){phase='menu'}
        
        if(phase=='menu')
        {   tempArr=[]
            if(!target.classList.contains('ship')){return}
            
            shipname = target.getAttribute('id')
            console.log(shipname)
            phase='placement'

        }
        if(phase =='placement')
        {   
            if(!target.classList.contains('cell')){return}
            let x = target.classList[0]
            console.log(shipname, x)
            tempArr.push(x)
            x= parseInt(tempArr[0])
            let y = parseInt(tempArr[1])
            if(tempArr.length>1){shipPlacer(x,y,shipname);phase='menu'}
            let td = document.querySelector('#ships')
            if (td.querySelectorAll('.ship').length<1){phase='play'}
            
        }
        if ( phase == 'play'){
            console.log('play')
            if(turn && target.classList.contains('e')){return}
            if(!turn && target.classList.contains('p')){return}
            turn=!turn
            let l = 'p'
            let who
            if(turn){l='e'}else if (!turn){l='p'}
            console.log(target.classList)
            if(target.classList.contains(l))
            {  
                let shot  = target
                turn?who=enemyShip:who=playerShips
                theGame(shot,who,l)
                
                console.log(turn)
            }
                
            else{return}
        }
 })
}
function boardMarker(hit,miss)
{   
    // if(!hit['e'] || !hit['p'] || !miss['p'] || !miss['e']){return}
    let arr=[hit,miss]
    arr.forEach(s => {
        s['e'].forEach( function (a){
            let td = document.getElementById('e'+a)
            td.classList.add('disabled')
        })
        s['p'].forEach( function (a){
            let td = document.getElementById('p'+a)
            td.classList.add('disabled')
        })
    });
    
}
function theGame(target,who,l)
{   boardMarker(hit,miss)
    console.log('im running')
    let missed = true
     // if(!target.classList.contains(t)){return}
    let shot = target.classList[0]
    // console.log(who)
    console.log(l)
    Object.keys(who).forEach(r =>{
        let ship= who[r]
        let loc = ship.location
        console.log('ship & shot locations: '+loc+'  '+shot )
        if(loc.includes(shot))
        {    missed=!miss
            ship.size-=1;
            hit[l].push(shot);
            target.classList.add('hit')
            console.log('you hit me!!')
            checkGameOver(who)
            return
        }
    
    })
    if(missed){;miss[l].push(shot);target.classList.add('miss');return}
    
}
//AI: get 2 int (0-9)+1, merge, place to the board, if hit chek adjacent, if hit run direction checker, if disbaled pick another random int
function checkGameOver(who)
{   let r=0
    Object.keys(who).forEach(function (y){
        r+=who[y].size
    })
    if(r==0){alert('Game Over!!');phase='gameover';return}else{return}
}
function directionChecker(x,y)
{   let x1,x2,y1,y2
    y1=slicer(x).a
    x1=slicer(x).b
    y2=slicer(y).a
    x2=slicer(y).b
    
    if(x1>x2){console.log('<-');return -1}
    else if (x1<x2){console.log('->');return +1}
    else if(y1>y2){console.log('^');return -100}
    else if(y1<y2){console.log('v');return +100}}

//slicing the coordinates
function slicer(x='')
{   
    x=x<1000?'0'+x.toString():x.toString()
    console.log('slicer is getting: '+x)
    x=x.toString();
    let a=x.slice(0,2);
    let b=x.slice(2,4);
    return {a,b}
}
function shipPlacer(x,y,selectedShip)
{   if(!x && !y && selectedShip){return}
    let broken=false
    ship = playerShips[selectedShip]
    loc = ship.location
    ship.location=[]
    size= ship.size
    dir = directionChecker(x,y)
    
    for(i=0;i<size; i++)
    {
        let xStr = x<1000?'0'+x.toString():x.toString()
            let td = document.getElementById('p'+xStr)
            if(td==null){break}
            arrFilled.push(x)
            ship.location.push(xStr)
            x+=dir
            
            
            if(arrFilled.includes(x))
            {   td.classList.remove('ship', selectedShip+i)
                
                broken=true;
                console.log('this space is not available');
                ship.location=[];
                break
            }else{
                td.classList.add('ship', selectedShip+i)
                document.getElementById(selectedShip).classList.remove('ship')
            }
    }
    
    ship.status='placed'

}
document.querySelector('#newGameButton').addEventListener('click',function(e){location.reload()})

function enemyShipPlacer()
{   let arrFilled=[]
    document.querySelectorAll('.filled').forEach(a => {a.classList.remove('filled');})
    Object.keys(enemyShip).forEach(e => {
        let ship= enemyShip[e]
        let size = ship.size
        ship.location=[]
        let locs=randomLoc(size)
        let x=locs[0]
        let dir = locs[1]
        console.log('IMPORT: Origin: '+x+' Direction: '+dir)
        for(i=0;i<size;i++)
        {   let xStr=x<1000?'0'+x.toString():x.toString()
            if(arrFilled.includes(x)){return enemyShipPlacer()}
            else{
            arrFilled.push(x)
            ship.location.push(xStr)
            
            x+=dir
            }
        }
        ship.status='placed'
        console.log(ship.location)
})
}
//worst way to check duplicates inside of dictionary, needs to be improved ,  IT DOESNT EVEN WORK..
function overlapChecker()
{   
    Object.keys(enemyShip).forEach(e => {
        ship = enemyShip[e]
        loc = ship.location
        loc.forEach(function (t) {
            // for(let i  in enemyShip){if(e!=i && enemyShip[i].location.includes(t)) {console.log(i);enemyShipPlacer()}}
            
            Object.keys(enemyShip).forEach(g =>
                {
                    if(enemyShip[g].location.includes(t) && e!=g && (t.length + enemyShip[g].location.length > 2 )){console.log(e,g+'\n'+ 'locations overlapped: ' +enemyShip[g].location+' and '+t); enemyShipPlacer()}    
                })
        })
    });
}
function shipShow(who)
{   a= who==playerShips?'p':'e'
    Object.keys(who).forEach(e => {
        if(who[e].status=='placed')
        {
        who[e].location.forEach(function (t)
            {
                console.log(a+t.toString())
                tde =  document.getElementById(a+t.toString())
                console.log(tde.classList+'   '+t)
                tde.classList.add('filled')
                // tde.classList.add(e+z)
                console.log(`placement in ${t}`)
                tde.classList.remove('selected')
            }) 
        }
    })
}
function randomLoc(size=5)
{ 
    let x=Math.round(Math.floor(Math.random()*900)/100)*100+Math.floor(Math.random()*9+101);
    
    let locPic=[1,-1,100,-100]
    let dir=locPic[Math.floor(Math.random()*4)]
    
    let limit= dir*(size-1)+x
    console.log('GENERATOR: origin: '+x+' GENERATOR: Direction: '+dir+' Limit is: '+limit )
    if(limit%100<1 || limit%100>10 || limit<101 || limit>1010){return randomLoc()}
    
    let arr=[x, dir]
    if(arr[0]<101){randomLoc()}
    return arr
}
function shipOverlapChecker(who={})
{
    Object.keys(who).forEach(e=>{
        ship=who[e]
        ship.location.forEach(t => {
        });
    })
}
const otoRun = setTimeout(enemyShipPlacer(), 20000);










// function shipMouseLoc(asd) {
//     asd.addEventListener('click',function(e)
//         {  
//             // if(asd.classList.contains('selectable')){return}
            
//             target = e.target
//             trgInner = target.innerHTML
//             shipTrgClass = target.classList
//             console.log(target.innerHTML)
//             output.innerHTML=trgInner
//             selectShips()
//         })}
// function selectShips()
// {   let origin,direction
//     console.log('Choose your Ship')
//     if(shipTrgClass)
//     {   console.log(`You have selected ${shipTrgClass[0]}.. Please select ship location: `)
//         boardMouseLoc(playerBoard)
        
//     }

// }
// function boardMouseLoc(asd) 
// {
//     asd.addEventListener('click',function(e)
//     {  
//         // if(asd.classList.contains('selectable')){return}
        
//         target = e.target
//         target.classList.toggle('selected')
//         trgInner = target.innerHTML
//         trgClass = target.classList
//         console.log(target.innerHTML)
//         output.innerHTML=trgInner
//         shipSelectCoordinator(trgClass)
//     })

// }
// function shipSelectCoordinator(trg,loc)
// {   let shipName = shipTrgClass[0]
//     let tempLoc= trg[0]
//     console.log(shipName)
//     playerShips[shipName].location.push(trg[0])
//     console.log(`You have selected:${trg[0]} for the ship, Now please choose direction you want to place your ship`)
    
// }


// document.querySelector('#newGameButton').addEventListener('click',function(e){newGame()})


