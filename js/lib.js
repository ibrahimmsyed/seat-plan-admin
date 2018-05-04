(function ($) {

  

  $.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };


    $('form').submit(function (e) {
	    e.preventDefault();
	    const ref = firebase.storage().ref();

	    var rootRef = firebase.database().ref();
	    var storesRef = rootRef.child("/users");

	    var data = $(this).serializeFormJSON();
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
		  firebase.database().ref('users/' + newUserIndex).set({email: data.email, username:data.username, dpurl : url});
		  
		  firebase.database().ref('/users/').once('value').then(function(snapshot) {
				  console.log(snapshot.val());
		});

		  document.querySelector('#image').src = url;
		}).catch((error) => {
		  console.error(error);
		});
	    
	});

})(jQuery);