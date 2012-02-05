function init() {
  addVersionButtons();
}

function download() {
  var version = getVersionInfo(this.parentElement);
  var info = getInfo();

  // Merge info and versions into one object.
  for (var attrname in version) {
    info[attrname] = version[attrname];
  }
  // Upload the PDF.
  uploadPDF(info, version.url, function(response) {
    console.log('great success!');
  });
}

// Gets metadata for the page
var REGEX = /(.+)\((.+)\)/
function getInfo() {
  var heading = document.querySelector('#firstHeading').innerText;
  var match = heading.match(REGEX);
  return {
    title: match[1],
    composer: match[2],
    type: 'sheet'
  }
}

function addVersionButtons() {
  // Iterate through all of the versions on the page, adding buttons to
  // download the version.
  var $versions = document.querySelectorAll('.we_file_download');
  for (var i = 0; i < $versions.length; i++) {
    var $ver = $versions[i];
    var $button = document.createElement('button');
    $button.innerText = 'send to smusique';
    $ver.appendChild($button);
    $button.addEventListener('click', download)
  }
}

function getVersionInfo($ver) {
  // Given a .we_file_download element, gets information about it.
  var $id = $ver.querySelector('.we_file_info2 > a');
  var type = $id.getAttribute('href').match(/\.(.+)$/)[1];
  // Only process PDFs.
  if (type != 'pdf') {
    return;
  }

  var $link = $ver.querySelector('a');
  var $rating = $ver.querySelectorAll('.we_file_info2 > span')[1];

  return {
    url: rewriteUrl($link.getAttribute('href')),
    label: $link.innerText.trim(),
    rating: $rating ? parseInt($rating.innerText) : null,
    id: parseInt($id.innerText.replace('#', ''))
  };
}

function rewriteUrl(url) {
  // Convert stuff like /wiki/Special:ImagefromIndex/67351 into stuff like
  // http://imslp.org/wiki/Special:IMSLPDisclaimerAccept/03785
  return 'http://imslp.org' + url.replace('ImagefromIndex',
                                          'IMSLPDisclaimerAccept');
}

function uploadPDF(info, url, callback) {
  // Uploads a PDF to the PDF to Image server. Responds with image URLs.
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
  formData.append('label', info.type);
  formData.append('rating', info.rating);
  formData.append('pdfurl', url);
  xhr.send(formData);
}

init();
