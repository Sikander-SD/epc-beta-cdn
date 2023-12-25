function notiHTML(title,body,time,id,pid) {return `
<div class="accordion-header">
  <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#_${id}" aria-expanded="false" aria-controls="_${id}">
    <div class="title">${title}</div>
  </button>
  <button type="button" class="btn-close" aria-label="Close"></button>
</div>
<div id="_${id}" class="accordion-collapse collapse" data-bs-parent="#${pid}">
  <div class="accordion-body">${body}</div>
</div>
<div class="timestamp">${time}</div>
`}