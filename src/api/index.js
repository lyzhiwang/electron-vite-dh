import request from '../utils/request'

// login
export function login(data) {
	return request({
		loading: true,
		url: '/user/login',
		method: 'post',
		data
	})
}

// change password
export function changePwd(data) {
	return request({
		loading: true,
		url: '/reset/password',
		method: 'patch',
		data
	})
}

// userinfo
export function getUserInfo(params) {
	return request({
		url: '/user/info',
		method: 'get',
		params
	})
}

// 数字人列表
export function humanList(params) {
	return request({
		url: '/human',
		method: 'get',
		params
	})
}

// 系统信息
export function sysInfo() {
	return request({
		url: '/sys/info',
		method: 'get',
	})
}

// 开播
export function startLive(project_id) {
	return request({
		url: '/start/broadcast/' + project_id,
		method: 'post',
	})
}

// 关播
export function endLive(project_id) {
	return request({
		url: '/end/broadcast/' + project_id,
		method: 'post',
	})
}

// 阿里云token
export function aliToken(params) {
	return request({
		url: '/ali/token',
		method: 'get',
		params
	})
}

// 创建项目
export function createProJect(data) {
	return request({
		loading: true,
		url: '/project',
		method: 'post',
		data
	})
}
// 删除项目
export function delProJect(id) {
	return request({
		loading: true,
		url: `/project/${id}`,
		method: 'delete',
	})
}
// 更新项目
export function updateProJect(id, data) {
	return request({
		loading: true,
		url: `/project/${id}`,
		method: 'put',
		data
	})
}

// 项目详情
export function projectDetail(id) {
	return request({
		loading: true,
		url: `/project/${id}`,
		method: 'get',
	})
}

// 项目列表
export function proJectList(params) {
	return request({
		loading: true,
		url: '/project',
		method: 'get',
		params
	})
}
// 生成视频
export function compositeVideo(project_id) {
	return request({
		loading: true,
		url: `/create/video/${project_id}`,
		method: 'post',
	})
}

// 获取预计生成时长
export function videoNeedTime(data) {
	return request({
		loading: true,
		url: '/count/project/duration',
		method: 'post',
		data
	})
}

// 直播生成进度
// export function synthetizedetail(id) {
// 	return request({
// 		loading: false,
// 		url: `/synthetize/detail/${id}`,
// 		method: 'get',
// 	})
// }
export function synthetizedetail(data) {
	return request({
		loading: false,
		url: `/synthetize/detail`,
		method: 'post',
		data
	})
}

// 视频记录
export function videoRecord(params) {
	return request({
		url: '/video/record',
		method: 'get',
		params
	})
}

// 语音记录
export function voiceRecord(params) {
	return request({
		url: '/voice/record',
		method: 'get',
		params
	})
}

// 轮播图
export function getBanner(params) {
	return request({
		url: '/banners/list',
		method: 'get',
		params
	})
}

// 直播间信息
export function liveRoomInfo(project_id) {
	return request({
		loading: true,
		url: '/broadcast/' + project_id,
		method: 'get',
	})
}
// 设置直播间信息
export function setLiveRoom(data) {
	return request({
		loading: true,
		url: '/broadcast/setting',
		method: 'post',
		data
	})
}
// 记录语音生成次数
export function voiceOrder(project_id) {
	return request({
		url: '/add/voice/' + project_id,
		method: 'post',
	})
}
// 获取抖音ws地址
export function getTiktokWs(params) {
	return request({
		url: '/tiktok/data',
		method: 'get',
		params
	})
}
// ---------------------------------------------------
// 欢迎语设置详情
export function getWelcome(project_id) {
	return request({
		url: '/welcome/' + project_id,
		method: 'get'
	})
}
// 欢迎语 设置
// 欢迎语规则设置
export function postWelcome(data) {
	return request({
		url: '/welcome',
		method: 'post',
		data
	})
}
// 音色列表
export function getTimbre(params) {
	return request({
		url: '/timbre',
		method: 'get',
		params
	})
}

// -------------------------------------------------
// 关键词互动
// 关键词互动规则列表
// 互动规则列表
export function getInteract(project_id) {
	return request({
		url: '/interact/' + project_id,
		method: 'get'
	})
}
// 添加关键词 互动规则
// 添加互动规则
export function postInteract(data) {
	return request({
		url: '/interact',
		method: 'post',
		data
	})
}
// 删除关键词 互动规则
export function delInteract(data) {
	return request({
		url: '/del/interact/' + data.id,
		method: 'post',
		data
	})
}
// 更新关键词 互动规则
export function updateInteract(data) {
	return request({
		url: '/update/interact/' + data.id,
		method: 'post',
		data
	})
}
// 关键词匹配
export function keywordInteract(data) {
	return request({
		url: '/keyword/matching',
		method: 'post',
		data
	})
}

// -----------------------------------------------------
// chatgpt
export function postchatgpt(data) {
	return request({
		url: '/chatgpt',
		method: 'post',
		data
	})
}

// -----------------------------------------------------
// 短视频
// 短视频背景图片列表
export function shortvideoBackgroundList(params) {
	return request({
		url: '/shortvideo/background/list',
		method: 'get',
		params
	})
}

// 字幕任务列表
export function shortvideoBackjob(params) {
	return request({
		url: '/job',
		method: 'get',
		params
	})
}

// 创建字幕任务
export function postjob(data) {
	return request({
		url: '/job',
		method: 'post',
		data
	})
}



// ----------------------------------------------------------
// 文件列表
