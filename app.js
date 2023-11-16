
		// Declaration of variables
		var method = "GET";
		const key =
		"U0PqJ5UprbVQExkXc7ZgsGVfIM7Z1O8Uiv7g2hOO";

        var exo ="https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+ps&format=csv";

		var url =
		"https://api.nasa.gov/planetary/apod?api_key="
				+ key + "&date=";
		var mode = true;
		var date;

		// Function definition to get date from
		// input box and supply in sendHttpRequest
		// function
		function getDate() {
			date = document.getElementById("date").value;
			// console.log(date);
			sendHttpRequest(method, url + date,
				mode).then((data) => {
				console.log(data);
				update(data);
			});

		}

		// Declaration of update function to
		// display the fetched data on webpage
		function update(data) {
			document.getElementById("pic_date")
				.innerHTML = data.date;

			document.getElementById("title")
				.innerHTML = data.title;

			document.getElementById("apod_pic")
				.src = data.url;

			document.getElementById("caption")
				.innerHTML = data.explanation;
			return data;
		}

		// Send request to nasa portal to data
		// using the XMLHttpRequest
		function sendHttpRequest(method, url, mode) {
			return new Promise((resolve, reject) => {

				var req = new XMLHttpRequest();
				req.onreadystatechange = function () {
					if (this.readyState == 4) {
						if (this.status == 200) {
							var data = JSON
								.parse(this.response);
							// console.log(data);
							resolve(data);
						}
					}
				}
				req.open(method, url, mode);
				req.send();
			});
		}