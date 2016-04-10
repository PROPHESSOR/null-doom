u_.gui = {
        
};


u_.menu = new function(){
    var t = this;
    
    t.screens = {};
    t.current = null;
    
    t.init = function( o ){        
        t.screens = o;        
        u_.openmenu('root');
    };
    
    t.back = function(){
        //$('#blocker').trigger('click');
        // sound
        s_.play( s_.menuback );
    };
    
    t.select = function(){
        var i = $('#menu .selector').attr('ind');
        
        console.log('--->',i);
        
        // sound
        s_.play( s_.menuselect );
    };
    
    t.down = function(){
        var i = $('#menu .selector').attr('ind');
        var items = t.screens[ t.current ].items;
                
        i = (i < items.length-1) ? parseInt(i)+1 : 0;                        
                
        var pos = $('#menu img#menu'+i).position();
        
        $('#menu .selector')
            .attr('ind', i )
            .css({
                top     : pos.top / 2, // x2 scale
                left    : pos.left / 2
            });  
        
        // sound
        s_.play( s_.menunext );
    };
    
    t.up = function(){
        var i = $('#menu .selector').attr('ind');
        var items = t.screens[ t.current ].items;
                
        i = (i > 0 ) ? parseInt(i)-1 : items.length-1;                        
                
        var pos = $('#menu img#menu'+i).position();
        
        $('#menu .selector')
            .attr('ind', i )
            .css({
                top     : pos.top / 2, // x2 scale
                left    : pos.left / 2
            });
            
        // sound
        s_.play( s_.menunext );        
    };
};

u_.openmenu = function( menuID ){
    console.log('u_.openmenu(',menuID,')');
    
    var o = u_.menu.screens[ menuID ];
    u_.menu.current = menuID;
    
    // clear 
    $('#menu').html('');

    // set background
    if (o.background)
    $('#blocker').prepend('<img class="background" src="'+ cfg.mod +'/gra/'+ o.background +'">');

    // set menu heading
    if (o.heading)
    $('#menu').prepend('<img class="heading" src="'+ cfg.mod +'/gra/'+ o.heading +'"><br/>');

    // draw items
    for (var i in o.items) {
        $('#menu').append('<img id="menu'+ i +'" src="'+ cfg.mod +'/gra/'+ o.items[i].img +'" /><br/>');                
        
        if (i == o.items.length-1) {
            window.setTimeout(function(){
                // add selector
                $('#menu').append('<img class="selector" ind="0" anim="0" src="'+ cfg.mod +'/gra/'+ o.selector.img[0] +'">');
                u_.menu.selector = o.selector;

                var pos = $('#menu img#menu0').position();

                $('#menu .selector')
                    .css({ 
                        left: pos.left /2, 
                        top: pos.top /2
                    });
                    
                // sound
                s_.play( s_.menuopen );
            },200);
        }
    }

    
};

u_.inmenu = function(){
    
    return $('#blocker').is(':visible');
};

$('#blocker').bind( 'click', function ( e ) {

    $('#blocker').hide();
    var element = document.body;

    // Ask the browser to lock the pointer
    element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

    if ( /Firefox/i.test( navigator.userAgent ) ) {

        if (cfg.fullscreen) {

            var fullscreenchange = function ( e ) {

                if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

                    document.removeEventListener( 'fullscreenchange', fullscreenchange );
                    document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

                    element.requestPointerLock();
                }

            };

            document.addEventListener( 'fullscreenchange', fullscreenchange, false );
            document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

            element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;
            element.requestFullscreen();

        } else {

            element.requestPointerLock();
        }

    } else {

            element.requestPointerLock();
    }

});