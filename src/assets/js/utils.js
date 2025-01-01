// 防抖
export function debunce(fn,delay){
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
// 节流
export function throttle(fn,delay){
    let prevTime = Date.now()
    return function(){
        if(Date.now() - prevTime >= delay){
            fn.apply(this,arguments)
            prevTime = Date.now()  
        }         
    }
}

export function hasAllProperties(obj1,obj2){
    if(typeof obj1 !== 'object' || typeof obj2 !== 'object'){
        return false;
    }
    for(let key in obj1){
        if(!obj2.hasOwnProperty(key)){
            return false;
        }
    }
    return true
}
