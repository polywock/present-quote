const params = new URLSearchParams(window.location.search)
const quote = getParam("quote") || "The winds change direction at night."
const style = getParam("style") || "red"

// Toggle this to enable/disable the reveal animation
const ANIMATE = true

document.documentElement.classList.add(`style-${style}`)

const quoteEl = document.getElementById('quote')
quoteEl.addEventListener("input", () => {
   let url = new URL(window.location.href)
   url.searchParams.set("quote", quoteEl.innerText.replaceAll(`\n`, `\\n`))
   window.history.replaceState({}, '', url.toString())
})


function revealQuote(text, { animate = ANIMATE } = {}) {
   if (!animate) {
      quoteEl.textContent = text
      return
   }

   quoteEl.innerHTML = `<span class="reveal-text">${escapeHtml(text)}</span>`
   const span = quoteEl.querySelector('.reveal-text')

   span.style.visibility = 'hidden'
   const fullWidth = span.offsetWidth
   span.style.width = '0px'
   span.style.visibility = 'visible'

   requestAnimationFrame(() => {
      span.style.width = fullWidth + 'px'
   })

   // After transition, remove inline width so natural width stays in effect.
   span.addEventListener('transitionend', function _cleanup(e) {
      if (e.propertyName === 'width') {
         span.style.width = ''
         span.removeEventListener('transitionend', _cleanup)
      }
   })
}

revealQuote(quote)

function escapeHtml(str) {
   return String(str)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;')
}

function getParam(key) {
   const value = params.get(key)
   if (key === "quote") {
      return decodeURIComponent(value || "").replaceAll(`\\n`, `\n`)
   }
   return decodeURIComponent(value || "") || undefined
}
