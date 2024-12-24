$(document).ready(function () {
	function isOpenModal() {
		return window.location.href.match(/#form/)
	}

	function historyChange() {
		const elemModal = document.querySelector('#modalForm')
		const modal = bootstrap.Modal.getOrCreateInstance(elemModal)
		if (isOpenModal() == null) {
			modal.hide()
		} else {
			modal.show()
		}
	}

	function formAddURL() {
		let currentURL = {
			modal: 'true',
		}
		window.history.pushState(currentURL, '', '#form')
	}

	function formClearURL() {
		window.history.back()
	}

	function saveItem(event) {
		window.localStorage.setItem(event.target.name, event.target.value)
	}

	function clearForm() {
		$('.formcarryForm').find('input, textarea').val('')
		$('.formcarryForm').find('.form-check-input').prop('checked', false)
		window.localStorage.clear()
	}

	$('#submitForm').click(function () {
		clearForm()
	})

	$('.formcarryForm').submit(function (e) {
		e.preventDefault()
		var href = $(this).attr('action')

		$.ajax({
			type: 'POST',
			url: href,
			data: new FormData(this),
			dataType: 'json',
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.status === 'success') {
					alert('Форма получена')
					clearForm()
				} else if (response.code === 422) {
					alert('Что-то пошло не так!')
					$.each(response.errors, function (key) {
						$('[name="' + key + '"]').addClass('formcarry-field-error')
					})
				} else {
					alert('Произошла ошибка: ' + response.message)
				}
			},
			error: function (jqXHR, textStatus) {
				const errorObject = jqXHR.responseJSON
				alert(
					'Запрос не удался, ' + errorObject.title + ': ' + errorObject.message
				)
			},
		})
	})

	document.getElementById('showFormBtn').addEventListener('click', formAddURL)
	document.getElementById('hideFormBtn').addEventListener('click', formClearURL)
	document.querySelector('form').addEventListener('change', saveItem)
	window.addEventListener('popstate', historyChange)
	historyChange()

	Object.keys(window.localStorage).forEach(function (i) {
		const inputElement = document.getElementsByName(i)[0]
		if (inputElement) {
			inputElement.value = window.localStorage.getItem(i)
		}
	})
})
