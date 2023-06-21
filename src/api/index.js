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