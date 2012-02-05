function init() {
  var pre = getPreElement();
  // Get the contents of the preformatted text.
  var content = pre.innerText;
  // Get info about the song.
  var info = getInfo();
  // Upload the song info to smusique using the uploader.
  uploadTab(info, content, function() {
    console.log('uploaded successfully!');
  });

  // My favorite:
  // Replace the page with the contents of the preformatted element.
  document.body.innerHTML = '<pre>' + content + '</pre>';
}

function getPreElement() {
  // Get all the preformatted elements in the page.
  var pres = document.querySelectorAll('pre');
  // If there are any,
  if (pres.length > 1) {
    // Get the one containing the tab
    var pre = pres[1];
    return pre;
  }
}

var REGEX = /ultimate-guitar.com\/.+\/(.+)\/(.+?)_(?:ver([0-9])_)?(crd|tab).htm/
function getInfo() {
  var url = document.location.href;
  var parsed = url.match(REGEX);
  console.log(parsed);
  // Gets the data about this tab from the page.
  return {
    composer: sanitizeTitle(parsed[1]),
    title: sanitizeTitle(parsed[2]),
    version: parsed[3] || '1',
    type: parsed[4],
    rating: parseInt(document.querySelector('.cnt_rate b').innerText),
    part: '1',
  };
}

function uploadTab(info, content, callback) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://smusique-uploader.appspot.com/');
  xhr.addEventListener('load', function() {
    if (this.status == 200) {
      callback('yay');
    }
  });

  var formData = new FormData();
  formData.append('title', info.title);
  formData.append('composer', info.composer);
  formData.append('notation', info.notation);
  formData.append('label', info.type + info.part);
  formData.append('rating', info.rating);
  formData.append('text', content);
  xhr.send(formData);
}

function sanitizeTitle(underScoreTitle) {
  var s = underScoreTitle;
  return s.replace(/_/g, ' ').toLowerCase()
     .replace(/^.|\s\S/g, function(a) { return a.toUpperCase(); });
}

init();
