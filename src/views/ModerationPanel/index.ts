import ServerReq from '@lib/api/Extension'
import { ExtensionConfigDataInStorage } from '@lib/storage'
import GetUserProfile from '@lib/api/Brainly/GetUserProfile'
import BrainlyApi from '@lib/api/Brainly/Legacy'
import { User } from '@typings/ServerReq'

interface LocalUser {
	avatar: string
	profileLink: string
	nick: string
	ranks: string[]
}

async function Call(method: string, path: string, data: any, options: any) {
	return await fetch(options?.parseDoc ? path : this.znanijaApiPath + path, {
		method: method,
		body: data ? JSON.stringify(data) : null,
		mode: 'cors',
		referrer: 'https://znanija.com/',
		referrerPolicy: 'strict-origin-when-cross-origin',
	}).then((response) => {
		if (!response.ok)
			return console.debug(`API вернуло ошибку со статусом ${response.status}`)
		return !options?.parseDoc ? response.json() : response.text()
	})
}

async function searchUser(value: string): Promise<LocalUser[]> {
	let fetchedUsers = [] as LocalUser[]
	var valueID = parseInt(value)
	if (String(valueID) === value) {
		let user = await GetUserProfile(valueID)
		fetchedUsers.push({
			avatar: user.avatar,
			profileLink: `/users/redirect_user/${valueID}`,
			nick: user.nick,
			ranks: user.ranks,
		} as LocalUser)
	}
	let page = (await Call('GET', `/users/search/${value}`, null, {
		parseDoc: true,
	})) as string
	if (page === undefined) return Promise.reject('Не удалось отправить запрос')
	for (let userDiv of new DOMParser()
		.parseFromString(page, 'text/html')
		.querySelectorAll('.usersTable div.user-data')) {
		let user = {} as LocalUser
		user.nick = userDiv.querySelector('.user-nick > .nick').textContent
		user.profileLink =
			'/users/redirect_user/' +
			(userDiv.querySelector('.user-nick>.nick') as HTMLLinkElement).href.match(
				/\d+$/g
			)[0]
		user.avatar = userDiv.children[0].querySelector('img').src.match(/static/)
			? userDiv.children[0].querySelector('img').src
			: '/img/avatars/100-ON.png'
		user.ranks = Array.from(
			userDiv.querySelectorAll(
				'.user-nick>*:not(:first-child):not(br):not(.options)'
			)
		).map((u) => u.textContent.replaceAll('\n', '').trim())
		fetchedUsers.push(user)
	}
	return fetchedUsers
}

function renderSearchUserContainer() {
	let container = `<li id="search_user_li" style="margin-top:10px;">
    <div class="extension sg-search"><input placeholder="Ник/id" class="extension sg-input sg-input--with-icon sg-search__input">
        <button class="sg-search__icon">
        <div class="sg-icon sg-icon--gray-secondary sg-icon--x16"><svg class="sg-icon__svg"><use xlink:href="#icon-search"></use></svg></div>
        </button>
    </div>
    <div class="search_user_results"><div class="search_user__results"></div></div>
    </li>`
	document
		.querySelector('.brn-moderation-panel__list>ul')
		.insertAdjacentHTML('beforeend', container)

	const userSearchBox = document.querySelector('#search_user_li')
	const userSearchInput = userSearchBox.getElementsByTagName('input')[0]
	const userSearchButton = userSearchBox.getElementsByTagName('button')[0]

	let find = async function () {
		let value = userSearchInput.value.trim()
		let results = await searchUser(value)
		userSearchBox.querySelector('.search_user__results').innerHTML =
			results?.length
				? `${results
						.map(
							(user) => `
        <div class="search_user__user">
        <img src="${user.avatar}">
        <div>
            <a target="_blank" href="${user.profileLink}">${user.nick}</a>
            <span>${user.ranks.join('<br>')}</span>
        </div>
        </div>
    `
						)
						.join('')}`
				: `<h3>Нет таких пользователей...</h3>`
	}
	userSearchInput.onsubmit =
		userSearchInput.onchange =
		userSearchButton.onclick =
			find
	userSearchInput.onkeyup = (event) => {
		if (event.key === 'Enter') find()
	}
}

function moderationPanel(me: User) {
	BrainlyApi.GetMe().then((meData) => {
		chrome.storage.sync.get((storageE) => {
			let storage = storageE as ExtensionConfigDataInStorage
			if (!storage.authToken || !storage.newModPanelEnabled) return
			let link = '/moderation_new/view_moderator/' + me.brainlyId // !!! mod history doesn't work until: token isn't your | you have mentor privileges
			let archiveLink = 'http://cbse.brainly.in/strive-for-better/RU/archive/'
			let spamoutRanks = [
				'spamout',
				'антиспамер',
				'старший антиспамер',
				'старший спамаут',
			]
			let slack = spamoutRanks.includes(me.ranks[0].toLowerCase())
				? 'spamouts'
				: 'znanija-mod'
			let forumLink = `https://${slack}.slack.com`
			let newModMenu = document.querySelector(
				'.brn-moderation-panel__list > ul > li:nth-child(2)'
			)
			let oldModMenu = document.querySelector('#moderate-functions > ul')
			let newMenu = document.querySelector('.brn-moderation-panel')
			let newMVSetted = storage.newModPanelEnabled // ? here was storage.modAllNewDesign, I don't know what option to use

			if (!newMenu) {
				// old page
				let newPanel = `<nav class="extension-panel brn-moderation-panel js-moderation-panel sg-hide-for-small-only">
		  <div class="sg-content-box">
			<div class="sg-content-box__actions sg-content-box__actions--with-elements-to-left js-moderation-panel-toggle">
			  <button class="brn-moderation-panel__button sg-button sg-button--solid sg-button--s" title="Панель модератора">
				<span class="sg-button__text">M</span>
			  </button>
			  </div>
			</div>
			<div class="brn-moderation-panel__content sg-box sg-box--padding-m sg-box--shadow js-moderation-panel-content hidden">
			<div class="sg-content-box">
			  <div class="sg-content-box__title"><h3 class="sg-headline sg-headline--small">Панель модератора</h3></div>
			  <div class="sg-content-box__content"><div class="brn-moderation-panel__list">
				<ul class="sg-menu-list sg-menu-list--small">
				  <li class="sg-menu-list__element action-count" style="font-size: 16px;" >Акции сегодня:</li>
				  <li class="sg-menu-list__element">
					<a class="sg-menu-list__link" href="/tasks/archive_mod">Модерировать все</a>
				  </li>
				  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${forumLink}">Форум</a></li>
				  <li class="sg-menu-list__element history" style="height:auto;"><a target="_blank" class="sg-menu-list__link" href="${link}">История действий</a><ul class="students sg-menu-list sg-menu-list--small hidden"></ul></li>
				  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${archiveLink}">Архив</a></li>
				  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderators/mod_list">Список модераторов</a></li>
				  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderation/ranking">Рейтинг Модераторов</a></li>
				  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="/moderators/holidays_show">Каникулы</a></li>
				</ul>
			  </div></div>
			</div>
		  </div>
		</nav>`
				document.querySelector('#moderate-functions-panel')?.remove()
				document.body.insertAdjacentHTML('afterbegin', newPanel)

				let panelContent = document.querySelector(
					'.brn-moderation-panel__content'
				)
				if (storage.newModPanelEnabled) panelContent.classList.remove('hidden')
				;(
					document.querySelector(
						'.extension-panel .brn-moderation-panel__button'
					) as HTMLButtonElement
				).onclick = () => {
					panelContent.classList.toggle('hidden')
					chrome.storage.local.set({
						newModPanel_expanded: !panelContent.classList.contains('hidden'),
					})
				}
			} else {
				// new page
				newModMenu?.insertAdjacentHTML(
					'afterend',
					`
		  <li class="sg-menu-list__element history" style="height:auto"><a target="_blank" class="sg-menu-list__link" href="${link}">История действий</a><ul class="students sg-menu-list sg-menu-list--small hidden"></ul><li>
		  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${archiveLink}">Архив</a><li>
		  <li class="sg-menu-list__element"><a class="sg-menu-list__link" href="${forumLink}">Форум</a></li>`
				)

				let oldForumLink = newMenu.querySelectorAll(
					"a[href*='znanija-mod.slack.com']"
				)?.[slack === 'spamouts' ? 0 : 1]
				if (oldForumLink) (oldForumLink.parentNode as HTMLElement).remove()
			}

			document
				.querySelector('.action-count')
				?.insertAdjacentHTML(
					'beforeend',
					`  <strong>${meData.user.mod_actions_count ?? '?'}</strong>`
				)

			// !!! What could be storage.students?
			// 	if (storage.students?.length) {
			// 		let ranking = await _API.getModRanking()
			// 		let me = { id: storage.id, nick: storage.nick }
			// 		let mods = [me, ...storage.students]

			// 		for (let i = 0, mod; i < mods.length, (mod = mods[i]); i++) {
			// 			for (modInRanking of ranking.data) {
			// 				if (mod.id !== modInRanking.user_id) continue
			// 				mods[mods.indexOf(mod)] = { ...mod, actions: modInRanking.value }
			// 			}
			// 		}

			// 		let historyElem = document.querySelector('.history > ul')
			// 		historyElem.innerHTML = mods
			// 			.map(
			// 				(moderator) => `<li class="sg-menu-list__element">
			//   <a target="_blank" class="sg-menu-list__link" href="/moderation_new/view_moderator/${
			// 			moderator.id
			// 		}"> ${moderator.nick} (${moderator.actions ?? '0'})</a>
			// </li>`
			// 			)
			// 			.join('')
			// 		historyElem.parentNode.querySelector('a').onclick = (event) => {
			// 			historyElem.classList.toggle('hidden')
			// 			return false
			// 		}
			// 	}
			if (storage.newModPanelEnabled) renderSearchUserContainer()

			function clearFlashes() {
				let oldFlashesContainer = document.querySelector('#flash-msg')
				let newFlashesContainer = document.querySelector(
					'.flash-messages-container.js-flash-messages.js-flash-messages-container .sg-flash__message.sg-flash__message--info'
				)
				let newFlashes = document.querySelectorAll(
					'.flash-messages-container.js-flash-messages.js-flash-messages-container>.sg-flash'
				)

				if (oldFlashesContainer)
					[...oldFlashesContainer.children].forEach(removeFlash)
				if (newFlashesContainer) [...newFlashes].forEach(removeFlash)
			}

			function removeFlash(element: HTMLElement) {
				if (
					element.innerText.match(
						/Слишком много пользователей отвечает этому критерию|Пользователь был заблокирован/
					)
				)
					element.remove()
			}
			clearFlashes()
		})
	})
}

if (document.getElementsByClassName('sg-button__text').length > 0)
	ServerReq.GetMe().then((me) => moderationPanel(me))
