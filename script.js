'use strict'

window.addEventListener('DOMContentLoaded', () => {
  let rawData = {}
  let info = {}
  let list = []

  fetchData ('https://rickandmortyapi.com/api/character/')

  function renderList(data) {
    rawData = data
    list = [ ...list, ...rawData.results ]
    info = rawData.info
    const listContainer = document.querySelector('#list')
    const hideModalButton = document.querySelector('#hide-modal')

    hideModalButton.addEventListener('click', hideModal)

    document.querySelector('.total').innerText = info.count
    document.querySelector('.current').innerText = list.length
    
    document.querySelector('.preloader').style.display = 'none'
    listContainer.innerHTML = ''

    list.forEach((character, i) => {
      let listItem = document.createElement('div')
      listItem.classList.add('list-item')
      listItem.setAttribute('data-id', i)
      listItem.innerHTML += `
      <div>${ i + 1 }. ${ character.name } </div>
      <div>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 511.995 511.995" style="enable-background:new 0 0 511.995 511.995;" xml:space="preserve">
        <path d="M381.039,248.62L146.373,3.287c-4.083-4.229-10.833-4.417-15.083-0.333c-4.25,4.073-4.396,10.823-0.333,15.083
          L358.56,255.995L130.956,493.954c-4.063,4.26-3.917,11.01,0.333,15.083c2.063,1.979,4.729,2.958,7.375,2.958
          c2.813,0,5.604-1.104,7.708-3.292L381.039,263.37C384.977,259.245,384.977,252.745,381.039,248.62z"/>
        </svg>
      </div>
      `
      listItem.addEventListener('click', e => showModal(i, e))
      listContainer.appendChild(listItem)
    })
  }

  function fetchData (url) {
    fetch(url)
    .then(response => {
      if (response.status !== 200) {
        console.log('sorry, error...')
      } else {
        return response.json()
      }
    })
    .then(json => {
      renderList(json)
      document.querySelector('.progress').style.transform = `translateX(${ list.length / (120 * 0.01) }%)`
      if (list.length < 120){
        fetchData (info.next)
      } else {
        setTimeout(() => {
          document.querySelector('.progress-bar').style.display = 'none'
        }, 300)
      }
    })
    .catch(err => console.log(err))
  }

  function showModal (id, e) {
    console.log(id)
    document.querySelector('#modal').classList.remove('hide')
  }

  function hideModal () {
    document.querySelector('#modal').classList.add('hide')
  }
})