import { last, shuffle, nth } from 'lodash-es' // throttle 节流  debounce 防抖 请调用lodash内的函数

// 秒转成时分秒
export function getTime(time) {
    // 转换为时分秒
    let h = parseInt(time / 60 / 60 % 24)
    h = h < 10 ? '0' + h : h   // 也可使用padStart()补0
    let m = parseInt(time / 60 % 60)
    m = m < 10 ? '0' + m : m
    let s = parseInt(time % 60)
    s = s < 10 ? '0' + s : s
    // 作为返回值返回
    return [h, m, s]
}

// 秒转成时分秒
export function getTime_two(time) {
  // 转换为时分秒
  let h = parseInt(time / 60 / 60 )
  h = h < 10 ? '0' + h : h   // 也可使用padStart()补0
  let m = parseInt(time / 60 % 60)
  m = m < 10 ? '0' + m : m
  let s = parseInt(time % 60)
  s = s < 10 ? '0' + s : s
  // 作为返回值返回
  return [h, m, s]
}

// 倒计时 
export const countDown = (sec) => {
  const timer = setInterval(() => {
    if (sec === 0) {
      clearInterval(timer);
    } else {
      sec--;
      const [h, m, s] = getTime(sec)
      return `${h}:${m}:${s}`
    }
  }, 1000);
}

/* 数组对象合并
 * let arr=[{id:1,name:'dylan'},{id:2,name:'kebi'}]
 * let arr1=[{id:1,position:'ceo'},{id:3,position:'sales'}]
 * output
 *  [
 *    { id: 1, position: 'ceo', name: 'dylan' },
 *    { id: 3, position: 'sales' },
 *    { id: 2, name: 'kebi' }
 *  ]
*/
export function mergeArr(arr, arr1, key){
  return arr.reduce((pre,cur)=>{
    let target=pre.find(ee=>ee[key] == cur[key])
    if(target){
      Object.assign(target,cur)
    }else{
      pre.push(cur)
    }
    return pre
  }, cloneDeep(arr1))
}

// 将小数点金额转换 如:
export function transAmt(amt, len){
  return parseFloat((amt).toFixed(len))
}

// buffer转ArrayBuffer
export function toArrayBuffer(buf) {
  var ab = new ArrayBuffer(buf.length);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buf.length; ++i) {
      view[i] = buf[i];
  }
  return ab;
}

// 随机播放函数
export function randomArr(data){
  // 先获取最后一个元素
  const lastOne = last(data)
  // 创建新的随机数组
  let newArr = shuffle(data)
  const first = nth(newArr, 0)
  if(first===lastOne){
    const second = nth(newArr, 1)
    newArr[0] = second
    newArr[1] = first
  }
  return newArr
}

// 测试随机函数
export function testRandom(){
  let arr = [{id:1,name:'北京'}, {id:2,name:'上海'}, {id:3,name:'广州'}, {id:4,name:'深圳'}]
  console.log(111, arr)
  setInterval(()=>{
    arr = randomArr(arr)
    console.log(2222, arr)
  },2000)
}