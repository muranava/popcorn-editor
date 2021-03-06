/* This Source Code Form is subject to the terms of the MIT license
 * If a copy of the MIT license was not distributed with this file, you can
 * obtain one at https://raw.github.com/mozilla/butter/master/LICENSE */

(function() {
  define( [ "core/logger", "core/eventmanager", "ui/page-element", "analytics" ],
          function( Logger, EventManager, PageElement, analytics ) {

    var __guid = 0;

    var Target = function ( options ) {
      options = options || {};

      var _id = "Target" + __guid++,
          _logger = new Logger( _id ),
          _name = options.name || _id,
          _element,
          _pageElement,
          _this = this,
          _iframeCover;

      EventManager.extend( _this );

      _element = document.getElementById( options.element );

      _iframeCover = document.createElement( "div" );
      _iframeCover.classList.add( "butter-iframe-fix" );
      _element.appendChild( _iframeCover );

      if( !_element ){
        _logger.log( "Warning: Target element is null." );
      }
      else {
        _pageElement = new PageElement( _element, {
          drop: function( element, position, popcornOptions ) {
            analytics.event( "Track Event Added", {
              label: "dropped"
            });
            _this.dispatch( "trackeventrequested", {
              element: element,
              iframeDiv: _iframeCover,
              target: _this,
              position: position,
              popcornOptions: popcornOptions
            });
          }
        });
      } //if

      this.destroy = function () {
        if ( _pageElement ) {
          _pageElement.destroy();
        }
      };

      Object.defineProperties( this, {
        view: {
          enumerable: true,
          get: function(){
            return _pageElement;
          }
        },
        name: {
          enumerable: true,
          get: function(){
            return _name;
          }
        },
        id: {
          enumerable: true,
          get: function(){
            return _id;
          }
        },
        elementID: {
          enumerable: true,
          get: function(){
            if( _element ){
              return _element.id;
            } //if
          }
        },
        element: {
          enumerable: true,
          get: function(){
            return _element;
          }
        },
        iframeDiv: {
          enumerable: true,
          get: function(){
            return _iframeCover;
          }
        },
        isDefault: {
          enumerable: true,
          get: function(){
            if( _element && _element.hasAttribute( "data-butter-default" ) ){
              return true;
            } //if
            return false;
          }
        },
        json: {
          enumerable: true,
          get: function(){
            var elem = "";
            if( _element && _element.id ){
              elem = _element.id;
            } //if
            return {
              id: _id,
              name: _name,
              element: elem
            };
          },
          set: function( importData ){
            if( importData.name ){
              _name = importData.name;
            } //if
            if( importData.element ){
              _element = document.getElementById( importData.element );
            } //if
          }
        }
      });

    }; //Target

    return Target;

  }); //define
}());
