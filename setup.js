function setup(){
    createCanvas(window.innerWidth, window.innerHeight * 0.6);
}

function mouseClicked(data){
    document.body.dispatchEvent(new CustomEvent('mouseClicked', { detail: data }));
}