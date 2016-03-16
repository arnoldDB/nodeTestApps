'use strict';

var app = (function() {

  var personsList;
  var relationshipsList;
  var movieList;

  var source;
  var type;
  var target;
  var asLabel;
  var property;

  function optionBuilder(elementArray, unknownString) {
    var documentFragment = document.createDocumentFragment();
    elementArray.forEach(function(element, index) {
      var option = document.createElement('option');
      if (element === -1) {
        option.innerHTML = unknownString;
      } else {
        option.innerHTML = element;
      } 
      option.value = element;
      documentFragment.appendChild(option);
    });
    return documentFragment;
  }

  function divBuilder(url, locale, showString) {

    var elementArray;
    var documentFragment = document.createDocumentFragment();
    var xhr = new XMLHttpRequest();

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState===4 && xhr.status===200) {
        elementArray = JSON.parse(xhr.responseText).topPersons;

        elementArray.forEach(function (element, index) {
          var outerDiv = document.createElement('div');
          outerDiv.className = 'mdl-cell mdl-cell--3-col mdl-cell--4-col-tablet mdl-cell--4-col-phone mdl-card mdl-shadow--3dp';

            var innnerDivPersonMedia = document.createElement('div');
            innnerDivPersonMedia.className = 'mdl-card__media';
              var innnerIPersonMedia = document.createElement('i');
                  innnerIPersonMedia.innerHTML = 'person';
                  innnerIPersonMedia.className ='material-icons';
                  innnerIPersonMedia.style.opacity = '0.46'; 
            innnerDivPersonMedia.appendChild(innnerIPersonMedia);
          outerDiv.appendChild(innnerDivPersonMedia);

            var innnerDivPersonName  = document.createElement('div');
            innnerDivPersonName.className = 'mdl-card__title';
              var innnerH4PersonName = document.createElement('h4');
                  innnerH4PersonName.className = 'mdl-card__title-text';
                  innnerH4PersonName.innerHTML = elementArray[index].row[0];
            innnerDivPersonName.appendChild(innnerH4PersonName);
          outerDiv.appendChild(innnerDivPersonName);

            var innnerDivRoles = document.createElement('div');
            innnerDivRoles.className = 'mdl-card__title';
              var innnerIMovieMedia = document.createElement('i');
                  innnerIMovieMedia.className = 'material-icons';
                  innnerIMovieMedia.style.opacity = '0.46';
                  innnerIMovieMedia.innerHTML = 'movie &nbsp;';
              var innnerH4AmountRoles = document.createElement('h4');
                  innnerH4AmountRoles.className ='mdl-card__title-text';
                  innnerH4AmountRoles.innerHTML = elementArray[index].row[2];
            innnerDivRoles.appendChild(innnerIMovieMedia);
            innnerDivRoles.appendChild(innnerH4AmountRoles);
          outerDiv.appendChild(innnerDivRoles);

            var innerDivMovieNames = document.createElement('div');
            innerDivMovieNames.className = 'mdl-card__supporting-text'
              var innerSpanMovieNames = document.createElement('sapn');
              innerSpanMovieNames.className = 'mdl-typography--font-light mdl-typography--subhead'
              elementArray[index].row[3].forEach(function (innerElement, innerIndex){
                var innerAMovieName = document.createElement('a');
                innerAMovieName.className = 'android-link';
                innerAMovieName.href = '/' + locale + '/movies/read/' + elementArray[index].row[4][innerIndex];
                innerAMovieName.innerHTML = innerElement + ' | ';
                innerSpanMovieNames.appendChild(innerAMovieName);
              });
            innerDivMovieNames.appendChild(innerSpanMovieNames)
          outerDiv.appendChild(innerDivMovieNames);

            var innerDivActions = document.createElement('div');
            innerDivActions.className = 'mdl-card__actions';
              var innerAActions = document.createElement('a');
                  innerAActions.className = 'android-link mdl-button mdl-js-buttonmdl-typography--text-uppercase';
                  innerAActions.href = '/' + locale + '/persons/read/' + elementArray[index].row[1];
                  innerAActions.innerHTML = showString;
            innerDivActions.appendChild(innerAActions);
          outerDiv.appendChild(innerDivActions);

          documentFragment.appendChild(outerDiv);
        });
        document.getElementById('TopPersons').appendChild(documentFragment);
      }
    };
    xhr.send();
  }

  function changeTargetList() {
    var valueText = type.options[type.selectedIndex].value;
    switch(valueText) {
      case 'ACTED_IN':
        target.options.length = 0;
        target.appendChild(movieList.cloneNode(true));
        asLabel.style.display = 'inline';
        property.placeholder = 'Role (in English)';
        property.size=20;
        property.style.display = 'inline';
        break;
      case 'DIRECTED':
      case 'PRODUCED':
      case 'REVIEWED':
      case 'WROTE':
        target.options.length = 0;
        target.appendChild(movieList.cloneNode(true));
        asLabel.style.display = 'none';
        if(valueText === 'REVIEWED') {
          property.placeholder='Summary (in English)';
          property.size=50;
          property.style.display = 'inline';
        } else {
          property.style.display = 'none';
        }  
        break;
      case 'FOLLOWS':
        asLabel.style.display = 'none';
        property.style.display = 'none';
        target.options.length = 0;
        target.appendChild(personsList.cloneNode(true));
        break;
      default:
        console.log('default');
    }
  }

  function toogleView(value) {
    target = document.getElementById('target');
    property = document.getElementById('property');

    switch(value.row[1]) {
      case 'ACTED_IN':
        property.style.display = 'block';
        property.innerHTML = 'as ' + value.row[3][0] + '.';
        break;
      case 'DIRECTED':
        property.style.display = 'none';
        break;
      case 'PRODUCED':
        property.style.display = 'none';
        break;
      case 'REVIEWED':
        property.style.display = 'block';
        property.innerHTML = 'Summary' + value.row[3] + '.';
        break;
      case 'WROTE':
        property.style.display = 'none';
        break;
      case 'FOLLOWS':
        target.innerHTML = value.row[2];
        property.style.display = 'none';
        break;
      default:
        console.log('default');
    }
  }

  function buildOptions(personslocal, relationshipslocal, movieslocal) {
    personsList = optionBuilder(personslocal);
    relationshipsList = optionBuilder(relationshipslocal);
    movieList = optionBuilder(movieslocal);

    source = document.getElementById('source');
    type = document.getElementById('type');
    target = document.getElementById('target');
    asLabel = document.getElementById('asLabel');
    property = document.getElementById('property');

    type.onchange = changeTargetList;
    
    source.appendChild(personsList.cloneNode(true));
    type.appendChild(relationshipsList.cloneNode(true));
    target.appendChild(movieList.cloneNode(true));
  }

  function buildDynamicDropdowns(element, url, inQueryParam, unknownString) {
    var xhr = new XMLHttpRequest();
    var distincValues; 

    xhr.open('GET', encodeURI(url));

    xhr.onreadystatechange = function() {
      if (xhr.readyState==4 && xhr.status==200) {
        distincValues = JSON.parse(xhr.responseText).distinctValues;
        distincValues.unshift(-1);            
        element.appendChild(optionBuilder(distincValues, unknownString));

        if(inQueryParam.length > 0) {
          element.value = inQueryParam;
        }
      }
    };

    xhr.send();
  }

  function changelocation(location, year, paramName) {
    if(isNaN(year)) {
      self.location = self.location.pathname;
    } else {
      self.location = location + '?' + paramName + '=' + year;   
    }
  }

  function changelocale(currentLocale, newLocale) {
    var newLocation= location.pathname.replace('/' + currentLocale + '/', newLocale + '/');
    location.replace(newLocation);
  }

  return {
    divBuilder: divBuilder,
    toogleView: toogleView,
    buildOptions: buildOptions,
    buildDynamicDropdowns: buildDynamicDropdowns,
    changelocation: changelocation,
    changelocale: changelocale,
  }; 
})();
