require(['app.js'], function(){
    require(['Main'], function(){});
});

function setup(){
    createCanvas(window.innerWidth, window.innerHeight * 0.75);
}

function mouseClicked(data){
    document.body.dispatchEvent(new CustomEvent('mouseClicked', { detail: data }));
}