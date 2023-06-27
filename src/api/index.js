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

// 轮播图
export function getBanner(params){
	return request({
		url: '/banners/list',
		method: 'get',
		params
	})
}

// ---------------------------------------------------
// 欢迎语设置详情
export function getwelcome(project_id) {
	return request({
		// /welcome/{project_id}
		url: '/welcome/' + project_id,
		method: 'get'
	})
}
// 欢迎语 设置
// 欢迎语规则设置
export function postwelcome(data) {
	return request({
		url: '/welcome',
		method: 'post',
		data
	})
}
// 音色列表
export function gettimbre(params) {
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
export function getinteract(params) {
	return request({
		url: '/interact/'+params.project_id,
		method: 'get',
		params
	})
}
// 添加关键词 互动规则
// 添加互动规则
export function postinteract(data) {
	return request({
		url: '/interact',
		method: 'post',
		data
	})
}
// 删除关键词 互动规则
export function delinteract(data) {
	return request({
		url: '/del/interact/' + data.id,
		method: 'post',
		data
	})
}
// 更新关键词 互动规则
export function updateinteract(data) {
	return request({
		url: '/update/interact/' + data.id,
		method: 'post',
		data
	})
}
// 关键词匹配
export function keywordinteract(data) {
	return request({
		url: '/keyword/matching',
		method: 'post',
		data
	})
}

// -----------------------------------------------------