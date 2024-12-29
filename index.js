let isWindowFocus = false;
let isMouseEnter = false;
let isStartRecord = false;


// 鼠标事件
let moveenter_flag = false;
window.addEventListener('blur',()=>{
    document.removeEventListener('mouseleave',handleMouseleave);
    document.removeEventListener('mouseenter',handleMouseenter);
})

window.addEventListener('focus',()=>{
    isMouseEnter = true;
    document.addEventListener('mouseenter',handleMouseenter)
    document.addEventListener('mouseleave',handleMouseleave)
})

function handleMouseenter(event){
    isMouseEnter = true;
    console.log('鼠标移入了',event)
}

function handleMouseleave(event){
    isMouseEnter = false;
    console.log('鼠标移出了',event)
}

// 录制
let throttleHandleMousemove = throttle(handleMousemove,15)
let cursorElement = document.getElementsByClassName('active_cursor')[0];
let cursorRecordPositions = [];
function handleBtnRecordStartOnclick(){ // 点击按钮为什么不回触发focus
    isStartRecord = true;
    cursorRecordPositions = []
    document.addEventListener('mousemove',throttleHandleMousemove)
}
function handleBtnRecordEndOnclick(){
    isStartRecord = false;
    console.log('录制结束')
    document.removeEventListener('mousemove',throttleHandleMousemove)
}
function handleBtnPlayCursorOnclick(){
    console.log('播放鼠标轨迹')
    let index = 0;
    const intervalId = setInterval(()=>{
        if(index == cursorRecordPositions.length - 1){
            clearInterval(intervalId)
            return;
        }
        index++;
        cursorElement.style.transform = `translate(${cursorRecordPositions[index].x}px,${cursorRecordPositions[index].y}px)`
    },15);
}
function handleMousemove(event){
    if(isMouseEnter){
        console.log('鼠标移动了:',event.clientX,event.clientY)
        cursorRecordPositions.push({
            x:event.clientX,
            y:event.clientY
        })
    }
}
// 防抖截流
function debunce(fn,delay){
    let timer = null;
    return function(){
        if(timer){
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            fn.apply(this,arguments)
        },delay)
    }
}
function throttle(fn,delay){
    let prevTime = Date.now()
    return function(){
        if(Date.now() - prevTime >= delay){
            fn.apply(this,arguments)
            prevTime = Date.now()  
        }         
    }
}
