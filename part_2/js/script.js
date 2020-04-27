/*Craig Bergmeyer
Script.js
INFO 2134
Thoendel
April 26, 2020*/


window.addEventListener('load', function() {
	let right = document.getElementById('right');
	let left = document.getElementById('left');



	displayLoading('left', 'Loading employee list...');

	let url = 'https://www.mccinfo.net/epsample/employees';

	fetch(url)
	.then (response => response.json())
		.then( (employees) => {
			console.log(employees);


			let para = document.createElement('p');
			para.innerHTML = 'Select an employee from the list below';

			let employeeList = document.createElement('select');
			employeeList.id = 'employeeList';
			let option = document.createElement('option');
			option.value = '';
			option.innerHTML = '---select an employee---';
			employeeList.appendChild(option);
		
			for (employee of employees){
				option = document.createElement('option');
				option.value = employee.id;
				option.innerHTML = `${employee.first_name} ${employee.last_name} (${employee.department.name})`;
				employeeList.appendChild(option);
			}

			clearContainer('left');
			left.appendChild(para);
			left.appendChild(employeeList);

			employeeList.addEventListener('change', onChange);

		})

	//Helper function
	function clearContainer(side) {
		switch(side) {
			case 'right':
				right.innerHTML = '';
				break;

			case 'left':
				left.innerHTML = '';
				break;

		}
	}


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

	function onChange(e) {
		console.log(e.target.value);
		//Begin Step 2
		//call various functions to clear than display loading then display employee info
		clearContainer('right');
		displayLoading('right', 'Loading employee info...');
		displayEmployeeInfo();
	}





	function displayEmployeeInfo(){

		//reused fetch to get employee.json
		fetch(url)
			.then (response => response.json())
				.then( (employees) => {
					
		//get employee selected 
		let selector = document.getElementById('employeeList');
		let selected = selector.options[selector.selectedIndex].value;
		
		if (selected > 0){
			selected = selected - 1;
			let employee = employees[selected];

			//get right element
			let container = document.getElementById('right');
			//create h1 and text
			let nameHeading = document.createElement('h1');
			nameHeading.innerHTML = employee.first_name + ' ' + employee.last_name;
			//create h2 and text
			let nameHeading2 = document.createElement('h2');
			nameHeading2.innerHTML = employee.department.name;
			//create p and body
			let body = document.createElement('p');
			body.innerHTML = `Salary: ${employee.annual_salary} <br>
								Hire Date: ${employee.hire_date}`;

			//Begin Step 4
			// create link for department link
			let link = document.createElement('a');
			link.id = 'departmentLink'
			link.href = '#departmentList';
			link.innerHTML = 'View Department';
			// clear the container then add new data
			clearContainer('right');
			container.appendChild(nameHeading);
			container.appendChild(nameHeading2);
			container.appendChild(body);
			container.appendChild(link);
			
			
			//Pause step 4 
			//Begin step 3
			// get pic url and promise and call to display image function
			picURL = employee.image_filename
			 fetch(picURL)
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
			
			
			
			//resume step 4
			//create h4 element and relevent material
			let department = document.getElementById('departmentLink')
			let departmentListHeader = document.createElement('h4');
			departmentListHeader.id = 'departmentListHeader';
			departmentListHeader.className = 'hidden';
			departmentListHeader.innerHTML = `Department: ${employee.department.name}`;
			
			//create h5 element and relevent material
			let departmentList = document.createElement('h5');
			departmentList.id = 'departmentList';
			departmentList.className = 'hidden';
			departmentList.innerHTML = `Employees <br> <hr>`; 
										
			//for loop to find employees in same department
			let departmentNum = employee.department.id;
			for (employee of employees){
				if (departmentNum == employee.department.id){
				departmentList.innerHTML += `<ul> ${employee.first_name} ${employee.last_name} `;
				}
			}
			//add to web page. Too lazy to get it under the pic
			container.appendChild(departmentListHeader);
			container.appendChild(departmentList);		
			
			
			
			department.addEventListener('click', onClick);
			//pause step 4
		} else {
			clearContainer('right')
		}

		
		
		})
	}
	// function to diplay the image
	function displayImage(wImg){
		//put the image in place 
		let img = document.createElement('img');
		right.appendChild(img);
		let imgUrl = URL.createObjectURL(wImg);
		img.src = imgUrl;
	}
	//End Step 3
	//resume step 4
	// function to make the sections visible on click
	function onClick(){
		document.getElementById('departmentListHeader').className = 'visible';
		document.getElementById('departmentList').className = 'visible';
	}
	//end step 4

});

