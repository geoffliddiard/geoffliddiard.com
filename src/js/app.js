(function (window, $) { 
    'use strict';
    
    /* App */

    function GL (){
        
        this.header;
        this.body;
        this.nav;

        var self = this;

        $(function (){
            self.init();
        });
        
    }

    GL.prototype.init = function (){
        
        var self = this;
    
        self.header = $('body > header');
        self.body   = $('html, body');
        self.nav    = $('a[href*="#"]:not([href="#"])');
        
        /*
        self.header.headroom({
            'offset': 20,
            'tolerance': 5
        });
        */
        
        self.addListeners()
    };

    GL.prototype.addListeners = function (){

        var self = this;

        self.nav.click(function() {
            if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
                if (target.length) {
                    self.body.animate({
                        scrollTop: target.offset().top
                    }, 500);
                    //return false;
                }
            }
        });

    };

    window.gl = new GL();
        
})(window, $);