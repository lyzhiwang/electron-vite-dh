const States = {
    text: 0, // 文本状态
    codeStartSm: 1, // 小代码块状态
    codeStartBig: 2, // 大代码块状态
}



/**
 * 判断 markdown 文本中是否有未闭合的代码块
 * @param text
 * @returns {boolean}
 */

function isInCode(text) {
    let state = States.text
    let source = text
    let inStart = true // 是否处于文本开始状态，即还没有消费过文本
    while (source) { // 当文本被解析消费完后，就是个空字符串了，就能跳出循环
        let char = source.charAt(0) // 取第 0 个字
        switch (state) {
            case States.text:
                if (/^\n?```/.test(source)) {
                    // 以 ``` 或者 \n``` 开头。表示大代码块开始。
                    // 一般情况下，代码块前面都需要换行。但是如果是在文本的开头，就不需要换行。
                    if (inStart || source.startsWith('\n')) {
                        state = States.codeStartBig
                    }
                    source = source.replace(/^\n?```/, '')
                } else if (char === '\\') {
                    // 遇到转义符，跳过下一个字符
                    source = source.slice(2)
                } else if (char === '`') {
                    // 以 ` 开头。表示小代码块开始。
                    state = States.codeStartSm
                    source = source.slice(1)
                } else {
                    // 其他情况，直接消费当前字符
                    source = source.slice(1)
                }
                inStart = false
                break
            case States.codeStartSm:
                if (char === '`') {
                    // 遇到第二个 `，表示代码块结束
                    state = States.text
                    source = source.slice(1)
                } else if (char === '\\') {
                    // 遇到转义符，跳过下一个字符
                    source = source.slice(2)
                } else {
                    // 其他情况，直接消费当前字符
                    source = source.slice(1)
                }
                break
            case States.codeStartBig:
                if (/^\n```/.test(source)) {
                    // 遇到第二个 ```，表示代码块结束
                    state = States.text
                    source = source.replace(/^\n```/, '')
                } else {
                    // 其他情况，直接消费当前字符
                    source = source.slice(1)
                }
                break
        }
    }
    return state !== States.text
}

export default isInCode