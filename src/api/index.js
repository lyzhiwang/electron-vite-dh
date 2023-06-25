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

// 阿里云token
export function aliToken(params){
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
export function projectDetail(id){
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
export function compositeVideo(data){
	return request({
		loading: true,
		url: '/create/video/{project_id}',
		method: 'post',
		data
	})
}

// 获取预计生成时长
export function videoNeedTime(params){
	return request({
		loading: true,
		url: '/project/duration',
		method: 'get',
		params
	})
}

// 视频记录
export function videoRecord(params){
	return request({
		url: '/video/record',
		method: 'get',
		params
	})
}

// 语音记录
export function voiceRecord(params){
	return request({
		url: '/voice/record',
		method: 'get',
		params
	})
}