/*jshint smarttabs:true */




/**
 * DOM ready function
 */
document.addEventListener('DOMContentLoaded',function(){

    
//    var serverHost  = 'myth.readingroom.local',
    var serverHost  = 'localhost',
	serverPort  = 8000,
	apiUrlTypes	    = 'http://' + serverHost + ':' + serverPort + '/shona/event_type',
	apiUrlEvents	    = 'http://' + serverHost + ':' + serverPort + '/shona/event',
	list	    = document.getElementById('list'),
        el_loading  = document.getElementById('loading'),
        loading     = false,
	event_types = [];
	

    
    
    /**
     * Show Loading Gif
     */
    function setLoading()
    {
        loading = true;
        el_loading.setAttribute( 'class','loading' );
    }
    
    /**
     * Remove Loading Gif
     */
    function unSetLoading()
    {
        loading = false;
        el_loading.setAttribute( 'class', null );
    }
    
    
    /**
     * Display all messages in the list
     * Messages are saved in the global(ish) variable, they are set by the AJAX function
     * Delete actions are bond to items as they are created
     */
    function updateMessages()
    {
	
	if( event_types.length ){
	    list.innerHTML = '';
	    var l = event_types.length,
                click_function = function(){
		    recordEvent( this.event_type_id );

		};
            
            
	    while( l-- ){
		var event = event_types[l],
		    li = document.createElement('li'),
		    button = document.createElement('button'),
		    id = event.pk;
		    
		    
		li.id = 'event_type_' + id;
		
		li.innerHTML = event.fields.name;
		li.event_type_id = id;
		    
		// delete button
		button.innerHTML = 'Record Event';
		button.id = 'button_' + id;
		button.event_type_id = id;
		button.addEventListener('click', click_function, true );
		li.appendChild( button );
		list.appendChild( li );
		
	    }
	}else{
	    // No calls, so clean up markup
	    list.innerHTML = '';
	}
    }
    
    /**
     * Send a post to the server against a certain event type to record it happening
     * Success function is run on successfull reciept of the message
     */
    function recordEvent( id )
    {
	var el_button	= document.getElementById( 'button_' + id ),
	    values = {
		'event_type' : id
	    },
	    req		= new XMLHttpRequest(),
	    jsondata	= JSON.stringify(values);
	    
	
	setLoading();
        el_button.setAttribute( 'disabled', 'disabled' );
	
	req.open( 'POST', apiUrlEvents + '/' + id, false );
	req.setRequestHeader( 'Content-type', 'application/json' );
	req.setRequestHeader( 'Accept', 'text/plain' );
	req.onreadystatechange  = function () {
	    
	    el_button.removeAttribute( 'disabled' );
	    if( 'True' === req.responseText ){
		unSetLoading();
		success();
	    }
	    
	}
	req.send( jsondata );
	
    }
    
    /**
     * Display visual success feedback to the user
     */
    function success()
    {
	var body = document.getElementsByTagName('body')[0];
	body.setAttribute( 'class', 'success' );
	window.setTimeout(function(){ body.setAttribute( 'class', null ) }, 500 );
    }
    


    // Init Code _______________________________________________________________

    // Check server status
    
    function updateMessagesRemote( callback ){
	var req = new XMLHttpRequest();
	req.open( 'GET', apiUrlTypes + '?format=json', true );
	req.onload = function () {
	                
            var res,
		meta;
            
	    // Process response
	    if ( req.readyState == 4 && req.status == 200 ) {
		res = JSON.parse( req.responseText );
	    }


	    // Put status indicator in place, if not alreay loaded
	    if( res && res.length > 0 && !document.getElementById('status') ){
		var span = document.createElement( 'span' );
		span.id = 'status';
		document.getElementById('title').appendChild( span );
	    }
	    
	    // There are messages, update local strore, and repopulate list
	    if( res.length > 0 ){
		event_types = res;
		updateMessages();
	    }
	    
	    if( 'function' == typeof(callback) ){
		callback();
	    }
	    
	};
	req.send();
    };
    
    /**
     * Pull in event types that are available
     */
    updateMessagesRemote();
      


}, false ); // End Dom ready

