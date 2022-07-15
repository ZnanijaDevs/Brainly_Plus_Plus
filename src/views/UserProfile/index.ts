import ServerReq from '@lib/api/Extension'
import GetWarns from '@lib/api/Brainly/GetWarns'
import { Warn } from '@typings/'

class UserProfile {
	userId: number = +window.location.pathname.match(/(?<=-)\d+/)

	constructor() {
		this.FetchUserFromExtensionServer()
	}

	async FetchUserFromExtensionServer() {
		const user = await ServerReq.GetUserByBrainlyId(this.userId)
		console.debug('user', user)
	}
}

interface template {
	title: string
	text: string
	isBL: boolean
}

let userProfile = new UserProfile()

function fillWarns(userId: number) {
	GetWarns(userId).then((warns) => {
		if (warns === undefined || warns.length === 0) return
		const moreUserData = document.getElementsByClassName('user-more-data')[0]
		const tableRows = warns.map((warn: Warn) => {
			return `<tr class="${warn.active ? 'active' : 'inactive'}">
              <td>${warn.time}</td>
              <td><a href="/task/${warn.taskId}" target="_blank">${
				warn.contentType
			}</a></td>
              <td class="ext-warn-content">${warn.content}</td>
              <td title="${warn.reason}">${beautifyReason(warn.reason)} (${
				warn.warner
			})</td>
          </tr>`
		})
		let tableHTML = `
      <table class="ext-user-warns">
        <caption>Предупреждения пользователя:</caption>
        <tbody>
          ${tableRows.join()}
        </tbody>
      </table>
      `
		moreUserData.insertAdjacentHTML('beforebegin', tableHTML)
	})

	function beautifyReason(reason: string) {
		const phrases = [
			{
				raw: 'осмысленные вопросы',
				beautified: 'Спам',
			},
			{
				raw: 'контрольных',
				beautified: 'К/р',
			},
			{
				raw: 'рекламной информации',
				beautified: 'Реклама',
			},
			{
				raw: 'ссылок на сторонние',
				beautified: 'Ссылка',
			},
			{
				raw: 'не связан с тематикой',
				beautified: 'Не школа',
			},
			{
				raw: 'ответом на заданный вопрос',
				beautified: 'Спам',
			},
			{
				raw: 'ответ скопирован',
				beautified: 'Копия',
			},
			{
				raw: 'на другие сайты',
				beautified: 'Ссылка',
			},
			{
				raw: 'комментарий не является',
				beautified: 'Не ответ',
			},
			{
				raw: 'реклама в вопросах',
				beautified: 'Реклама',
			},
			{
				raw: 'ненормативная лексика',
				beautified: 'Оскорбление',
			},
			{
				raw: 'в грубой форме',
				beautified: 'Культура',
			},
			{
				raw: '',
				beautified: 'Пред.',
			},
		]
		for (let entry of phrases) {
			if (reason.includes(entry.raw)) return entry.beautified
		}
	}
}

function addBanImplant() {
	function rand(arr: string[]) {
		return arr[Math.floor(Math.random() * arr.length)]
	}

	function getCTemplates(): template[] {
		let newPTs = []
		for (let template of document.querySelectorAll('.profile-templates tr')) {
			if (!template.querySelector('.del-row')) continue

			let t: template = {
				title: (template.querySelector('.title') as HTMLInputElement).innerText,
				text: (template.querySelector('.text') as HTMLInputElement).innerText,
				isBL: (template.querySelector('input') as HTMLInputElement).checked,
			}

			if (!t.title.length || !t.text.length) return []
			newPTs.push(t)
		}
		return newPTs.reverse()
	}

	function getBanMessageElements() {
		return {
			greeting: rand([
				'Здравствуйте!\n',
				'Добрый день!\n',
				'Приветствую вас!\n',
				'Уважаемый участник сообщества Знаний!\n',
				'Доброго времени суток!\n',
			]),
			banReminder: rand([
				'\nЧтобы начался отсчёт времени бана, зайдите в любой вопрос и ознакомьтесь с правилами нашего сообщества.',
				'\nДля начала временного ограничения доступа к сайту зайдите в любой вопрос и внимательно прочитайте напоминание о правилах.',
				'\nДля того, чтобы бан начался (и закончился) быстрее, вы можете зайти в любой вопрос. Появится напоминание о правилах, после согласия с которыми начнётся отсчёт времени.',
			]),
			ending: rand([
				'\nЕсли у вас есть вопросы, вы можете задать их мне в ответном сообщении',
				'\nС уважением, команда модераторов',
				'\nЖелаю вам удачи и хорошего настроения',
				'\nСпасибо за понимание',
				'\nНадеюсь на ваше сотрудничество',
				'\nРассчитываю на ваше содействие',
				'\nНадеюсь, что в дальнейшем вы будете соблюдать правила нашего сообщества',
				'\nХорошего вам дня от команды модераторов',
			]),
			banExplanations: {
				'Не ответ':
					'Уточняющие условие вопросы, как и советы автору задания можно писать ТОЛЬКО в поле для комментариев ("Попроси больше комментариев" под вопросом, если вы заходите в наше сообщество с компьютера). Если вы пишете комментарии вместо ответа, то они будут удалены, баллы за ответ будут забраны, а вам выдано предупреждение и бан.\nОзнакомиться с правилами нашего сообщества и основных принципах модерации можно, перейдя по ссылке https://znanija.com/pravila-kontenta. ',
				'Копии':
					'Добавляемые ответы должны быть написаны лично вами! Размещение копий чужих ответов, текстов с любых сайтов или ссылки на них недопустимы. Если Вы дадите такой "ответ", то он будет удалён, баллы возвращены автору вопроса, а вам выдано предупреждение и бан.\nОб этом и о других правилах нашего сообщества можно прочитать, перейдя по ссылке: https://znanija.com/pravila-kontenta ',
				'Спам':
					'Добавление вопросов и ответов, не имеющих смысла или отношения к заданному вопросу или образованию, так же, как и ответы типа: "я не знаю", "посмотри в интернете", "помоги решить" – расцениваются как спам и строго наказываются. При этом баллы не засчитываются, а при выявлении нарушения даются предупреждение и бан.\nОб этом и о других правилах нашего сообщества можно прочитать, перейдя по ссылке: https://znanija.com/pravila-kontenta ',
				'Лимит':
					'Модераторы предупреждают пользователей о нарушениях правил нашего сообщества. В связи с тем, что количество допущенных вами нарушений превышает максимум, мы вынуждены удалить Ваш аккаунт.',
				'Оскорбления':
					'Оскорбления пользователей нашего сообщества недопустимы и строго наказываются, вплоть до удаления аккаунта. Относитесь уважительно к другим пользователям, пожалуйста.',
				'Мат':
					'Цель нашего сообщества – совместное обучение, употребление ненормативной лексики является серьёзным нарушением правил и наказывается удалением аккаунта.',
				'Ник':
					'Наш образовательный сайт является публичным местом. Выбирая ник, помните, что цель сообщества Знаний – совместное обучение. Аккаунт пользователя с ником, подобным вашему, удаляется.',
				'Контент':
					'Наш образовательный сайт является публичным местом. Контент, который вы публикуете, является грубым нарушением правил, за что аккаунт пользователя удаляется.',
				'Реклама':
					'Согласно правилам сайта за размещение рекламы, платных услуг или иной информации подобного рода аккаунт пользователя подлежит удалению.',
				'Правила':
					'Обратите внимание: в нашем сообществе действует система предупреждений и банов за нарушение правил. За многократные или грубые нарушения аккаунт может быть удален. Соблюдать наши правила несложно: вопросы задавайте полностью и без ошибок, отвечайте, только если уверены в верности решения. Вопросы по заданию размещайте только в комментариях. Запрещены ссылки, задачи из контрольных работ, зачётов и экзаменов, копии чужих решений и текстов. Недопустимы бессмысленные вопросы и записи, не относящиеся к учебе, а также оскорбительные слова и выражения. Подробнее на https://znanija.com/pravila-kontenta',
			},
		}
	}

	let panelHtml = `<div class="new-ext-panel">
  <h2>Панель модерации</h2>
  <div class="ban-duration">
    <h3>Продолжительность бана</h3>
    <input type="range" step=1 min=0 max=6 value=0 id="ban-duration"></input>
    <label for="ban-duration">Не давать</label>
    <div class="choosers">
      <button class="ban-duration-chooser clear-ban">x</button>
      <button class="ban-duration-chooser violator">0'</button>
      <button class="ban-duration-chooser violator">15'</button>
      <button class="ban-duration-chooser violator">60'</button>
      <button class="ban-duration-chooser violator">12 ч</button>
      <button class="ban-duration-chooser violator">24 ч</button>
      <button class="ban-duration-chooser violator">48 ч</button>
    </div>
  </div>
  <div class="reason">
    <h3>Причина</h3>
    <input type="text" id="ban-reason"></input>
    <input type="checkbox" id="to-delete"></input>
    <label for="to-delete">В ЧС</label>
    <div class="choosers">
    <button class="ban-reason-chooser">x</button>
    <button class="ban-reason-chooser">Не ответ</button>
    <button class="ban-reason-chooser">Копии</button>
    <button class="ban-reason-chooser">Спам</button>
    <button class="ban-reason-chooser">Оскорбления</button>
    <button class="ban-reason-chooser violator">Лимит</button>
    <button class="ban-reason-chooser violator">Мат</button>
    <button class="ban-reason-chooser violator">Ник</button>
    <button class="ban-reason-chooser violator">Контент</button>
    <button class="ban-reason-chooser violator">Реклама</button>
    <button class="ban-reason-chooser warn">Правила</button>
  </div>
</div>
<div class="message-for-user">
  <h3>Сообщение пользователю</h3>
  <textarea maxlength=2000 id="user-message"></textarea>
</div>
<div class="submit-buttons">
  <button class="ban-submit">Применить</button>
  <button class="quick-delete">∞ спамов</button>
</div>
</div>`

	document
		.querySelector('#main-right')
		.insertAdjacentHTML('beforeend', panelHtml)

	const banMessageEl = getBanMessageElements()
	let durations = {
		0: 'Не давать',
		1: 'Учебник',
		2: '15 минут',
		3: '60 минут',
		4: '12 часов',
		5: '24 часа',
		6: '48 часов',
	}
	let explanations = banMessageEl.banExplanations

	let ctemplates = getCTemplates()

	let customTemplatesHTML = ''
	for (let template of ctemplates?.reverse() || []) {
		customTemplatesHTML += `
    <button class='ban-reason-chooser${template.isBL ? ' violator' : ''}'>${
			template.title
		}</button>`
		explanations[template.title] = template.text
	}
	document
		.querySelector('.ban-reason-chooser.warn')
		.insertAdjacentHTML('afterend', customTemplatesHTML)

	let durInput = document.querySelector('#ban-duration') as HTMLInputElement
	let durButtons = document.querySelectorAll(
		'.ban-duration-chooser'
	) as NodeListOf<HTMLInputElement>
	let durLabel = document.querySelector(
		'label[for=ban-duration]'
	) as HTMLInputElement
	durInput.oninput = function () {
		durLabel.innerHTML = durations[(this as HTMLInputElement).value]
		updateTextArea()
	}
	for (let i = 0; i < 7; i++) {
		durButtons[i].onclick = function () {
			durInput.value = i.toString()
			durLabel.innerHTML = durations[i]
			updateTextArea()
		}
	}

	let reasonInput = document.querySelector('#ban-reason') as HTMLInputElement
	let reasonButtons = document.querySelectorAll(
		'.ban-reason-chooser'
	) as NodeListOf<HTMLInputElement>

	let reasonForUser = ''
	let toDel = document.querySelector('#to-delete') as HTMLInputElement
	let maxBanDurationButton = document.querySelector(
		'.choosers > .ban-duration-chooser.violator:last-child'
	) as HTMLInputElement

	toDel.oninput = reasonInput.oninput = updateTextArea
	for (let button of reasonButtons) {
		button.onclick = function () {
			reasonInput.value = (this as HTMLInputElement).innerHTML
			if ((this as HTMLInputElement).classList.contains('violator')) {
				toDel.checked = true
				maxBanDurationButton.click()
			} else if ((this as HTMLInputElement).innerHTML === 'x') {
				toDel.checked = false
				reasonInput.value = ''
			} else {
				toDel.checked = false
			}
			reasonForUser = explanations[(this as HTMLInputElement).innerHTML] || ''
			updateTextArea()
		}
	}

	function updateTextArea() {
		let { greeting, banReminder, ending } = getBanMessageElements()

		let header = ''
		let reminder = ''
		if (toDel.checked) {
			header = 'Обратите внимание, ваш аккаунт будет удалён.\n'
		} else if (durLabel.innerHTML != 'Не давать') {
			if (durLabel.innerHTML === 'Учебник') {
				header = `Вам дан бан "Учебник".\n`
			} else {
				header = `Вам дан бан на ${durLabel.innerHTML}.\n`
				reminder = banReminder
			}
			if (reasonInput.value != 'Правила' && reasonInput.value != '')
				header += `Причина: ${reasonInput.value}.\n`
		}
		let message = header + reasonForUser + reminder
		if (message.length > 0) {
			message = greeting + message + ending
			document.querySelector('#user-message').innerHTML = message
		}
	}

	if (!document.querySelector('#UserBanType'))
		(
			document.querySelector('.new-ext-panel') as HTMLInputElement
		).style.display = 'none'
	setUpSubmit()
}

function setUpSubmit() {
	let link = document.URL
	let userId = link.match(/-(\d*)/)[1]
	function giveBan(banType: number) {
		if (banType < 1 || banType > 6) return
		;(document.querySelector('#UserBanType') as HTMLInputElement).value =
			banType.toString()
		;(document.querySelector('#UserBanAddForm') as HTMLFormElement).submit()
	}
	function sendMessage(message: string) {
		chrome.runtime.sendMessage({
			type: 'SendPM',
			data: { userId: userId, message: message },
		})
	}
	function sendToSlack(reason: string) {
		chrome.runtime.sendMessage({
			type: 'SendToSlack',
			data: { link: link, reason: reason },
		})
	}
	function disableButtonTemporarily(btn: HTMLButtonElement, duration: number) {
		btn.disabled = true
		setTimeout(() => (btn.disabled = false), duration)
	}
	function disableButtons() {
		disableButtonTemporarily(document.querySelector('.ban-submit'), 5000)
		disableButtonTemporarily(document.querySelector('.quick-delete'), 5000)
	}

	;(document.querySelector('.ban-submit') as HTMLInputElement).onclick =
		function () {
			let message = (
				document.querySelector('#user-message') as HTMLInputElement
			).value
			let banType = parseInt(
				(document.querySelector('#ban-duration') as HTMLInputElement).value,
				10
			)
			let reason = (document.querySelector('#ban-reason') as HTMLInputElement)
				.value
			let isToDelete = (
				document.querySelector('#to-delete') as HTMLInputElement
			).checked

			let MESSAGE_NO_REASON =
				'Вы уверены, что хотите отправить сообщение в слак, не добавив причину удаления?'
			let MESSAGE_NO_MESSAGE =
				'Вы уверены, что хотите забанить пользователя, но не отправлять ему сообщение о причине бана? Это можно делать только в крайних случаях.'
			if (!banType && !reason && !isToDelete) return
			if (isToDelete && !reason && !confirm(MESSAGE_NO_REASON)) return
			if (banType && !message && !confirm(MESSAGE_NO_MESSAGE)) return

			disableButtons()
			sendMessage(message)
			if (isToDelete) sendToSlack(reason)
			if (banType) giveBan(banType)
			else location.reload()
		}
	;(document.querySelector('.quick-delete') as HTMLInputElement).onclick =
		function () {
			;(
				document.querySelector(
					'.ban-reason-chooser.violator'
				) as HTMLInputElement
			).click()
			;(
				document.querySelector(
					'.ban-duration-chooser:last-child'
				) as HTMLInputElement
			).click()
			;(document.querySelector('#ban-reason') as HTMLInputElement).value =
				'Спам'
			;(document.querySelector('.ban-submit') as HTMLInputElement).click()
		}
}

function miscStaff(userId: number) {
	function addBtnToResponses(userId: number) {
		document
			.querySelector('#main-right')
			.insertAdjacentHTML(
				'afterbegin',
				`<a id="answers-link" href="/users/user_content/${userId}/responses">Перейти к ответам пользователя</a>`
			)
	}

	function limits() {
		const warnsTxt = document.querySelector(
			'.fright > span.orange > a'
		) as HTMLInputElement
		if (!document.querySelector('form#UserBanAddForm') || !warnsTxt) return
		const userRank = (
			document.querySelector('.rank>h3>a') as HTMLInputElement
		)?.innerText.toLowerCase()
		const points = Number.parseInt(
			(document.querySelector('.points>h1') as HTMLInputElement).innerText
		)
		const ranksForPoints = [
			{ points: 20000, rank: 'главный мозг' },
			{ points: 15000, rank: 'профессор' },
			{ points: 10000, rank: 'светило науки' },
			{ points: 7500, rank: 'почетный грамотей' },
			{ points: 4000, rank: 'ученый' },
			{ points: 1500, rank: 'отличник' },
			{ points: 750, rank: 'умный' },
			{ points: 250, rank: 'хорошист' },
			{ points: 100, rank: 'середнячок' },
			{ points: Number.NEGATIVE_INFINITY, rank: 'новичок' },
		]
		let pointsRank
		for (let entry of ranksForPoints) {
			if (points >= entry.points) {
				pointsRank = entry.rank
				break
			}
		}

		const rank = userRank ?? pointsRank
		const statuses = {
			'новичок': '5',
			'середнячок': '5',
			'хорошист': '5',
			'умный': '10',
			'отличник': '20',
			'ученый': '25',
			'почетный грамотей': '25',
			'светило науки': '25',
			'профессор': '30',
			'главный мозг': '30',
		}
		warnsTxt.insertAdjacentHTML(
			'beforeend',
			`<span style="font-weight: normal">/${statuses[rank] ?? '∞'}</span>`
		)
	}

	function showBan() {
		let info = document.querySelectorAll(
			'#profile-mod-panel > ul:nth-child(2) > li'
		) as NodeListOf<HTMLInputElement>
		let data = {}
		for (let k = 0; k < info.length; k++) {
			if (info[k].childNodes.length === 2)
				data[(info[k].childNodes[0] as HTMLFormElement).data] = (
					info[k].childNodes[1] as HTMLElement
				).innerText
		}
		if (!data['Тип: ']) return
		let validityText = 'Ещё не начался'
		if (data['Expires: ']) {
			validityText = 'До окончания: '
			let ms =
				new Date(data['Expires: '] + '+0300').getTime() - new Date().getTime()
			let msInSecond = 1000
			let msInMinute = 60 * msInSecond
			let msInHour = 60 * msInMinute
			let h = Math.floor(ms / msInHour)
			ms %= msInHour
			let m = Math.floor(ms / msInMinute)
			ms %= msInMinute
			let s = Math.floor(ms / msInSecond)
			validityText += `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`
		}
		let banType = (data['Тип: '][0] === 'У' ? '' : 'на ') + data['Тип: ']
		document.querySelector('.info_top').classList.add('banned')
		document
			.querySelector('.info_top > .rank')
			.insertAdjacentHTML(
				'afterend',
				`<span>Бан ${banType}. ${validityText}.<br>Выдан модератором ${data['Выдан : ']}</span>`
			)
	}

	addBtnToResponses(userId)
	limits()
	showBan()
}

function insertDelPanel() {
	const delUserForm = document.getElementById('DelUserAddForm')
	if (!delUserForm) return

	const sendForm = function (form: HTMLFormElement) {
		const formData = new FormData(form)
		return fetch(form.action, {
			method: 'post',
			body: formData,
			redirect: 'manual',
		})
	}

	document.getElementsByClassName('mod-profile-panel')[0].insertAdjacentHTML(
		'afterbegin',
		`
		<div id="xDelUser">
			<div class="row">
				<div role="checkbox" class="active">Аккаунт</div>
				<div role="checkbox">Задачи</div>
				<div role="checkbox" class="active">Решения</div>
				<div role="checkbox" class="active">Комментарии</div>
				<button data-state=0>Удалить</button>
			</div>
			<div class="row">
				<div role="radio" data-reason="Ваш аккаунт был удалён за оскорбление пользователей сообщества.">Оскорбление</div>
				<div role="radio" class="active" data-reason="Мы вынуждены удалить ваш аккаунт в связи с систематическим нарушением правил сайта.">Лимит</div>
				<div role="radio" data-reason="Аккаунт удален по желанию Пользователя">Желание</div>
				<div role="radio" data-reason="Ники, подобные Вашему, недопустимы на образовательном сайте. Мы вынуждены удалить Ваш аккаунт.">Ник</div>
				<div role="radio" data-reason="Ваш аккаунт был удалён за размещение недопустимого на образовательном сайте контента.">Контент</div>
				<div role="radio" data-reason="За троллинг">Троллинг</div>
			</div>
			<div class="row">
				<textarea class="reason" value="Мы вынуждены удалить ваш аккаунт в связи с систематическим нарушением правил сайта.">Мы вынуждены удалить ваш аккаунт в связи с систематическим нарушением правил сайта.</textarea>
			</div>
		</div>
	`
	)
	const deleteButton = document.querySelector(
		'#xDelUser>.row>button'
	) as HTMLInputElement
	const resetButton = () => {
		if (deleteButton.dataset.state === '2') return
		deleteButton.dataset.state = '0'
		deleteButton.innerText = 'Удалить'
	}
	const reasonTextArea = document.querySelector('#xDelUser>.row>.reason')
	for (const el of document.querySelectorAll(
		'#xDelUser>.row>div[role=checkbox]'
	)) {
		el.addEventListener('click', () => {
			el.classList.toggle('active')
			resetButton()
		})
	}
	for (const el of document.querySelectorAll(
		'#xDelUser>.row>div[role=radio]'
	) as NodeListOf<HTMLInputElement>) {
		el.addEventListener('click', () => {
			const currentActive = document.querySelector(
				'#xDelUser>.row>div[role=radio].active'
			) as HTMLInputElement
			if (currentActive === el) return
			if (currentActive) currentActive.classList.remove('active')
			el.classList.add('active')
			;(reasonTextArea as HTMLInputElement).value = el.dataset.reason
			resetButton()
		})
	}
	reasonTextArea.addEventListener('input', () => {
		const currentActive = document.querySelector(
			'#xDelUser>.row>div[role=radio].active'
		) as HTMLInputElement
		if (currentActive) currentActive.classList.remove('active')
		resetButton()
	})
	deleteButton.addEventListener('click', async () => {
		const activeActions = document.querySelectorAll(
			'#xDelUser>.row>div[role=checkbox].active'
		)
		switch (deleteButton.dataset.state) {
			case '0':
				if (activeActions.length === 0) {
					deleteButton.innerText = 'Нечего удалять'
				} else {
					deleteButton.dataset.state = '1'
					deleteButton.innerText = 'Точно?'
				}
				break
			case '1':
				deleteButton.dataset.state = '2'
				deleteButton.disabled = true
				deleteButton.innerText = 'Удаляю'
				const actionsToDo = {}
				for (let i = 0; i < activeActions.length; i++) {
					actionsToDo[(activeActions[i] as HTMLInputElement).innerText] = true
				}
				const commentsForm = document.querySelector(
					'form[action$=delete_comments]'
				) as HTMLFormElement
				const responsesForm = document.querySelector(
					'form[action$=delete_responses]'
				) as HTMLFormElement
				const tasksForm = document.querySelector(
					'form[action$=delete_tasks]'
				) as HTMLFormElement
				const userForm = document.querySelector(
					'form[action*="users/delete/"]'
				) as HTMLFormElement
				if (actionsToDo['Задачи']) await sendForm(tasksForm)
				if (actionsToDo['Решения']) await sendForm(responsesForm)
				if (actionsToDo['Комментарии']) await sendForm(commentsForm)
				if (actionsToDo['Аккаунт']) {
					;(userForm.querySelector('#DelUserReason') as HTMLFormElement).value =
						(reasonTextArea as HTMLInputElement).value
					await sendForm(userForm)
				}
				window.location.reload()
				break
			default:
				console.log(deleteButton.dataset.state)
		}
	})
}

fillWarns(userProfile.userId)
addBanImplant()
miscStaff(userProfile.userId)
insertDelPanel()
