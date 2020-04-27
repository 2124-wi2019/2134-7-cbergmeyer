/*Craig Bergmeyer
Script.js
INFO 2134
Thoendel
April 26, 2020*/


window.addEventListener('load', function() {

let right = document.getElementById('right');
let airportCode = document.getElementById('airportCode');
let actionGetWeather = document.getElementById('actionGetWeather');

	actionGetWeather.addEventListener('click', ()=> {
		if(checkAirportCode()) {
			displayLoading('right');
			let url = 'https://w1.weather.gov/xml/current_obs/display.php?stid=K' + airportCode.value;

			fetch(url)
			.then( (response) => {
				if (response.ok) {
					return response;
				} else{
				throw new Error('Error ' + response.statusText);
				}
			})

				.then( response => response.text())
					.then( text => displayData(text))
						//****I don't get where the error is coming from
						.then( error => console.log(error) );
		}
	})

	//Begin Step 2
	//add blur function to check airport code on loss of focus
	airportCode.addEventListener ('blur', function(){ 
	
		if (!checkAirportCode()){
			displayErrorMessage();
			airportCode.focus();
		} else {
			clearErrorMessage();
		}
	});

	// Helper functions
	//function to display error message
	function displayErrorMessage(){
		let errorHolder = document.getElementById('errorHolder')
		errorHolder.className = ('visible');
		errorHolder.classList.add('error');
		errorHolder.classList.add('errorBox');
		errorHolder.innerHTML = '';
		errorHolder.innerHTML = 'Error: You must enter a valid 3 digit code';
	}
	//function to clear error messages
	function clearErrorMessage(){
		let errorHolder = document.getElementById('errorHolder')
		errorHolder.className = 'hidden';
		errorHolder.innerHTML = '';
	}
	//End Step 2

	
	function displayLoading(side, loadingText){
		if(loadingText == undefined) loadingText = "loading content...";
		if (side != 'left' && side != 'right'){
			throw new Error ('Error: displayLoading only accepts left or right');
		} else{
			let container = document.getElementById(side);
			let loadingTextContainer = document.createElement('p');
			loadingTextContainer.innerHTML = loadingText;
			container.appendChild(loadingTextContainer);

			let loadingImageContainer = document.createElement('div');
			loadingImageContainer.classList.add('loading');
			loadingImageContainer.classList.add('centered');		
			container.appendChild(loadingImageContainer);

		}
	}

	function clearLoading(){
		right.innerHTML = '';
	}
	
	function checkAirportCode(){
		
		if (airportCode.value == '' ) return false;
		//Begin Step 3
		//took this out since I am achecking length in one step
		//if (airportCode.value.length >3) return false;
		if (airportCode.value.length != 3) return false;
		//create an array for the cities to be used
		//I assume there is a way to get the information from the text file, but it probably 
		//should have been in csv or xml or json.
		let cities = ['anw','aia','auh','bie','bta','hde', 'bbw', 'cdr', 'olu', 'fnb',
		'fet', 'gri','hsi', 'hjh', 'iml','ear','ibm','lxn','lnk','mck','mle','afk','ofk','lbf',
		'onl','oga','off','oma','odx','pmv','bff','sny','tqe','tif','vtn','ahq','lcg','jyr'];
		//loop through available cities and check against the input.  If there is a match it stops and returns 
		//true otherwise it hits the false at the end
		for (city in cities){
			if (airportCode.value.toLowerCase() == cities[city]) {
				return true;
			}
		} 
		//changed this to return false 
		return false;
		//End Step 3
		
	}

	function displayData(xml){
		let parser = new DOMParser();
		let xmlDoc = parser.parseFromString(xml, 'text/xml');
		let location = xmlDoc.getElementsByTagName('location')[0].innerHTML;
		let temp_f = xmlDoc.getElementsByTagName('temp_f')[0].innerHTML;
		let temp_c = xmlDoc.getElementsByTagName('temp_c')[0].innerHTML;
		//undefined elements
		//let windchill_f = xmlDoc.getElementsByTagName('windchill_f')[0].innerHTML;
		//let windchill_c = xmlDoc.getElementsByTagName('windchill_c')[0].innerHTML;
		let visibility_mi = xmlDoc.getElementsByTagName('visibility_mi')[0].innerHTML;
		let wind_mph = xmlDoc.getElementsByTagName('wind_mph')[0].innerHTML;
		let wx = `The current temperature in ${location} is ${temp_f} F`;
		//beging step 6
		right.innerHTML = '';
		//I'm not really sure what you want other than changing the url to have 'large' in it.
		let imageSize = 'large';
		//End Step 6

		//Begin Step 4
		// set H1 element annd string
		let heading = document.createElement('h1');
		heading.id = 'Weather Heading'
		heading.innerHTML = 'Current Weather';
		right.appendChild(heading);
		//set h2 element and string
		let heading2 = document.createElement('h2');
		heading2.id = 'Weather Heading2'
		heading2.innerHTML = location;
		right.appendChild(heading2);
		//set p element with string info
		let body = document.createElement('p');
		body.id = 'weather info'
		body.innerHTML = `Temperature: ${temp_f} &degF (${temp_c} &deg C)
						  <br> Wind Speed: ${wind_mph} MPH 
						  <br> Visibility: ${visibility_mi} miles`;
		right.appendChild(body);
		//End Step 4
		//Begin Step 5
		
		
		//Get path to weather icon
		let icon_url_name = xmlDoc.getElementsByTagName('icon_url_name')[0].innerHTML;
		// got the base also, but decide it wasn't worth trying to just get the first part and ignore
		//the <icon_url_name> part.
		let icon_url_base = xmlDoc.getElementsByTagName('icon_url_base')[0].innerHTML;
		let url = `http://forecast.weather.gov/images/wtf/${imageSize}/${icon_url_name}`;
		//fetch the image or call error if image isn't there
		fetch(url)
		  	.then( (response) => {
				if (response.ok) {
					return response;
				} else{
				throw new Error('Error ' + response.statusText);
				}
			})
		  	//promises for the blob.  call the display image function
			.then( response => response.blob())
					.then(blob => displayImage(blob))
						//****I don't get where the error is coming from
						.then( error => console.log(error));
		}
		//function to display the image
		function displayImage(wImg){
		//put the image in place 
		let img = document.createElement('img');
		right.appendChild(img);
		let imgUrl = URL.createObjectURL(wImg);
		img.src = imgUrl;
		}
		//End Step 5

});