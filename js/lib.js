(function ($) {

	const ref = firebase.storage().ref();
	var rootRef = firebase.database().ref();
	var floors;
	var seats;
	var special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
	var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

    $('.submit-block').on('click',function(){
    	var floor_count = $('#floor-count').val();
    	var seat_count = $('#seat-count').val();
    	console.log(floor_count +' '+ seat_count)
    	firebase.database().ref('block').set({floor: floor_count, seat:seat_count});
    	
    });

    firebase.database().ref('/block').once('value').then(function(snapshot) {
    	if(snapshot.val()){
				floors = parseInt(snapshot.val().floor);
				seats = parseInt(snapshot.val().seat);
    		}
    	if(floors){
			console.log(floors);
			for(i=1;i<floors+1;i++){
				$(".floor-select").append("<option value="+i+">" + stringifyNumber(i) + "</option>");
			}
		}
	});



    $('.assign-user').on('click',function() {
	    
	    var email = $('#email').val();
	    var username = $('#username').val();
	    var seat_no = $('#seat-value').val();
	    var floor_no = $('#floor-value').val();

	    console.log(floor_no);


	    var storesRef = rootRef.child("/users");
	    var newUserIndex;
		storesRef.on('value', snap =>{
			newUserIndex = snap.val().length;    
		});
		if(newUserIndex == undefined){newUserIndex = 0;}
		const file = $('#dp').get(0).files[0];
	    const metadata = { contentType: file.type };
	    const name = (+new Date()) + '-' + file.name;
	    const task = ref.child(name).put(file, metadata);

	    task.then((snapshot) => {
	      	const url = snapshot.downloadURL;
		  	console.log(url);
		  	firebase.database().ref('users/' + floor_no + '/' + seat_no).set({email: email, username: username, dpurl: url});
		  
		  	firebase.database().ref('/users/').once('value').then(function(snapshot) {
				  console.log(snapshot.val());
			});
		}).catch((error) => {
			console.error(error);
		});
	    
	});

	function stringifyNumber(n) {
	  if (n < 20) return special[n];
	  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
	  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
	}

})(jQuery);