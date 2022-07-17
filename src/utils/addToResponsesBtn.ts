export default (userId: number) => {
	document
		.querySelector('#main-right')
		.insertAdjacentHTML(
			'afterbegin',
			`<a id="answers-link" href="/users/user_content/${userId}/responses" style="#answers-link {background-color: #5bb8ff;border-radius: 60px;text-align: center;color: white !important;font-size: larger !important;font-weight: bold;font-family: "system-ui";border: 2px solid #5bb8ff;float: right;padding: 12px 0;margin-bottom: 10px;width: 100%;display: block;-webkit-transition-duration: 0.4s;transition-duration: 0.4s;}#answers-link:hover {background-color: white;color: #5bb8ff !important;}">
			Перейти к ответам пользователя
			</a>`
		)
}
