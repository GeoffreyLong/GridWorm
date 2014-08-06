$(document).ready(function(){
  // Takes in an element, the number of rows, and the number of columns
  var grid = new function(){
    // TODO stop the border double highlight problem

    // TODO should probably clean up the instantiation
    // to a better function design

    this.init = function(elm, height, width){
      this.setCellHeight(elm, height);
      this.setCellWidth(elm, width);
      this.createCells(elm, height, width);
      this.startDrop();
    };

    this.setCellHeight = function(elm, height){
      this.cellHeight = elm.height() / height;
    };

    this.setCellWidth = function(elm, width){
      this.cellWidth = elm.width() / width;
    };

    this.getCellWidth = function(){
      return this.cellWidth;
    };

    this.getCellHeight = function(){
      return this.cellHeight;
    };

    this.createCells = function(elm, height, width){
      for (var i=0; i < parseInt(height); i++){
        for (var j=0; j < parseInt(width); j++){
          var drop = $('<div class="drop"></div>');
          drop.css({
            'height':this.cellHeight+'px',
            'width':this.cellWidth+'px',
            'top':(i)*this.cellHeight+'px',
            'left':(j)*this.cellWidth+'px',
          });
          drop.attr('data-isOccupied', '-1');
          drop.attr('data-row', i);
          drop.attr('data-column', j);
          elm.append(drop);
        }
      }
    };

    this.startDrop = function(){
      $('.drop').droppable({
        tolerance: 'pointer',
        over: function(event, ui){
          $(this).addClass('status-over');
        },
        out: function(event, ui){
          var unoccupied = $(this).attr('data-isOccupied') == '-1';
          var occupiedByDragged = $(this).attr('data-isOccupied') == ui.draggable.attr('data-id');
          if (occupiedByDragged || unoccupied){ 
            $(this).removeClass('status-over');
            if (occupiedByDragged)
              $(this).addClass('in-transit');
          }
        },
        drop: function(event, ui){
          if ($(this).attr('data-isOccupied') == '-1'){
            var dragId = ui.draggable.attr('data-id');
            if (!dragId){
              dragId = new Date().getTime();
            }
            ui.draggable.attr('data-id', dragId);
            $(this).attr('data-isOccupied', dragId);
            $(this).droppable('option', 'accept', ui.draggable);
          }
          ui.draggable.position( { of: $(this), my: 'center', at: 'center' } );
        },
      });
    };
  }();
  
  grid.init($('#gameBoard'), 15, 15);

  createDraggables();

  $('.drag').draggable({
    revert: function(wasDropped){
      var previousDrop = $('.in-transit');
      if (wasDropped){
        previousDrop.attr('data-isOccupied', -1);
        previousDrop.droppable('option', 'accept', '.drag');
        previousDrop.removeClass('in-transit');
        return false;
      }
      else{
        previousDrop.removeClass('in-transit');
        previousDrop.addClass('status-over');
        return true;
      }
    },
  });
  
  // This function is just for demonstration purposes
  function createDraggables(){
    var i = 0;
    var drag = null;

    // Create Player One's
    for (i = 0; i < 3; i++){
      drag = $('<div class="drag"></div>');
      drag.addClass('player-one');
      drag.css({
        'top': 60*i+60+'px',
        'left': '10px',
        'height': grid.getCellHeight()-3+'px',
        'width': grid.getCellWidth()-3+'px',
      });
      $('body').append(drag);
    }

    // Create Player Two's
    for (i = 0; i < 3; i++){
      drag = $('<div class="drag"></div>');
      drag.addClass('player-two');
      drag.css({
        'top': 60*i+60+'px',
        'right': '10px',
        'height': grid.getCellHeight()-3+'px',
        'width': grid.getCellWidth()-3+'px',
      });
      $('body').append(drag);
    }
  }

});
