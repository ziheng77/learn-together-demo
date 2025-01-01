import {throttle} from '@js/utils.js'
import '@components/MonacoEditor.js'

let isWindowFocus = false;
let isMouseEnter = false;
let isStartRecord = false;
let throttleHandleMousemove = throttle(handleMousemove,15)
let cursorElement = document.getElementsByClassName('active_cursor')[0];
let bodyElement = document.getElementsByTagName('body')[0];
let cursorRecordPositions = [];

bodyElement.addEventListener('mouseenter',handleMouseenter)
bodyElement.addEventListener('mouseleave',handleMouseleave)
// 鼠标事件
window.addEventListener('blur',()=>{
    if(isStartRecord){
        const setIntervalId = setInterval(()=>{
            if(isMouseEnter){
                clearInterval(setIntervalId)
                return;
            }
            cursorRecordPositions.push(cursorRecordPositions[cursorRecordPositions.length - 1])
        },15)
    }
    bodyElement.removeEventListener('mouseleave',handleMouseleave);
    bodyElement.removeEventListener('mouseenter',handleMouseenter);
})

window.addEventListener('focus',()=>{
    isMouseEnter = true;
    bodyElement.addEventListener('mouseenter',handleMouseenter)
    bodyElement.addEventListener('mouseleave',handleMouseleave)
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

function handleBtnRecordStartOnclick(){ // 点击按钮为什么不会触发focus
    isStartRecord = true;
    cursorRecordPositions = []
    bodyElement.addEventListener('mousemove',throttleHandleMousemove)
}
function handleBtnRecordEndOnclick(){
    isStartRecord = false;
    console.log('录制结束')
    console.log(cursorRecordPositions)
    bodyElement.removeEventListener('mousemove',throttleHandleMousemove)
}
function handleBtnPlayCursorOnclick(){
    console.log('播放鼠标轨迹')
    let index = 0;
    const intervalId = setInterval(()=>{
        if(index == cursorRecordPositions.length - 1 || cursorRecordPositions.length == 0){
            clearInterval(intervalId)
            return;
        }
        const position = cursorRecordPositions[index];
        if ('x' in position && 'y' in position) {
            cursorElement.style.transform = `translate(${position.x}px, ${position.y}px)`;
            index++;
        } else {
            console.error('鼠标轨迹数据错误');
        }
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


// 暴露函数
window.handleBtnRecordStartOnclick = handleBtnRecordStartOnclick;
window.handleBtnRecordEndOnclick = handleBtnRecordEndOnclick;
window.handleBtnPlayCursorOnclick = handleBtnPlayCursorOnclick;
