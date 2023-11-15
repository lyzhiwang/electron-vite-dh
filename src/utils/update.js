// const { app, autoUpdater, dialog } = require('electron')
// const server = 'https://your-deployment-url.com'
// http://192.168.3.74:5014/
// /update/flavor/:flavor/:platform/:version[/:channel]
// const server = 'http://192.168.3.74:5014'
// // const url = `${server}/update/${process.platform}/${app.getVersion()}`
// const url = `${server}/update/2/${app.getVersion()}`
// autoUpdater.setFeedURL({ url })


// require('update-electron-app')()

// // 检查是否有更新。每十分钟检查一次
// setInterval(() => {
//     console.log('检查是否有更新。每分钟检查一次')
//     autoUpdater.checkForUpdates()
// }, 60000)

// // 更新提示
// autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
//     const dialogOpts = {
//         type: 'info',
//         buttons: ['立即重启', '以后再说'],
//         title: '应用程序更新',
//         message: process.platform === 'win32' ? releaseNotes : releaseName,
//         detail: '已下载新版本，重新启动应用程序以应用更新。'
//     }

//     dialog.showMessageBox(dialogOpts).then((returnValue) => {
//         if (returnValue.response === 0) autoUpdater.quitAndInstall()
//     })
// })

// // 
// autoUpdater.on('error', message => {
//     console.error('更新应用程序时出现问题')
//     console.error(message)
// })


// import { app, autoUpdater, dialog } from 'electron'
// console.log('app', app)
// console.log('autoUpdater', autoUpdater)
// console.log('dialog', dialog)


export function updateHandle(window, feedUrl) {
    const { app, autoUpdater, dialog } = require('electron')
    // const packagedata = require("./package.json");
    // console.log(packagedata.version);
    console.log('process.versions.electron', app)
    console.log('process.versions.electron', autoUpdater)
    console.log('process.versions.electron', dialog)
    const server = 'http://192.168.3.74:5014'
    const url = `${server}/update/flavor/2/${process.platform}/${app.getVersion()}`
    autoUpdater.setFeedURL({ url })

    require('update-electron-app')()

    // 检查是否有更新。每十分钟检查一次
    setInterval(() => {
        console.log('检查是否有更新。每分钟检查一次')
        autoUpdater.checkForUpdates()
    }, 60000)

    // 更新提示
    autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
        const dialogOpts = {
            type: 'info',
            buttons: ['立即重启', '以后再说'],
            title: '应用程序更新',
            message: process.platform === 'win32' ? releaseNotes : releaseName,
            detail: '已下载新版本，重新启动应用程序以应用更新。'
        }

        dialog.showMessageBox(dialogOpts).then((returnValue) => {
            if (returnValue.response === 0) autoUpdater.quitAndInstall()
        })
    })

    // 
    autoUpdater.on('error', message => {
        console.error('更新应用程序时出现问题')
        console.error(message)
    })
}