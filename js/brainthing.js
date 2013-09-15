BoardView = Backbone.View.extend({
  initialize: function() {
    this.render()
    this.click = 0
    this.disableTile()
  },
  events: {
    "click #retry": 'restart',
    "click .tile": 'tileClick',
    "click #stupidme": function () {
      this.transition().animate('distracted')
    }
  },
  render: function() {
    var options = {
      board: this.model.pattern.path,
      level: this.model.level,
      points: this.model.points,
      life: this.model.life
    }
    var template = _.template($('#board').html(), options)
    this.$el.html(template)
    this.highlight()
  },
  disableTile: function() {
    this.undelegateEvents()
  },
  highlight: function() {
    var rows = this.$el.children('#matrix').children('div.row')
    var self = this
    
    $.each(rows, function(key) {
      if (self.model.pattern.path.length == 4) {
        var sizeClass = 'sizefour'
      } else if (self.model.pattern.path.length == 5) {
        var sizeClass = 'sizefive'
      }
      var parentKey = key
      $.each($(this).children('span.tile'), function(key) {
        if (sizeClass)
          $(this)
          .addClass(sizeClass)
          .parent('div.row')
          .addClass(sizeClass)
          .parent('#matrix')
          .addClass(sizeClass)
        if(self.model.pattern.path[parentKey][key] == 1)
          $(this).addClass('active')
      })
    })
    setTimeout(function() {
      rows.children('span.tile').removeClass('active')
      self.delegateEvents()
    }, 500)
  },
  tileClick: function(e) { 
    var target = $(e.target)
    var parentPos = target.parent().attr('data-rownum')
    var targetPos = target.attr('data-tilenum')
    var pattern = this.model.pattern
    if(target.hasClass('active') == false) {
      if(pattern.path[parentPos][targetPos]) {
        target.addClass('active')
        this.click++
        if(this.click == pattern.filledTiles) {
          this.disableTile()
          this.transition().animate('happy')
        }
      } else {
        this.disableTile()
        this.model.life -= 1
        if (this.model.life >= 1) {
          this.transition().animate('sad')
        } else {
          this.endGame()
        }
      }
    }  
  },
  transition : function() {
    var self = this
    var animate = function(mood) {
      setTimeout(function() {
        var callback = moods[mood]
        $('div.layer')
        .removeClass('happy sad distracted backtext')
        .addClass(mood)
        .empty()
        $('div.layer-container').fadeIn('fast')	
        setTimeout(function() {
          $('div.layer-container').fadeOut('fast')
          if (callback) callback()
          self.click = 0
          self.render()
        }, 800)
      }, 200)
    }
    var moods = {
      happy: self.model.getNextLevel,
      distracted: self.model.penalty
    }
    return { animate : animate } 
  }, 
  endGame : function() {
    this.delegateEvents()
    $('div.layer')
    .removeClass('happy sad distracted')
    .addClass('backtext')
    .prepend(
      '<p>'
      + 'You saved '+ this.model.points +' Jigglypuffs. '
      + 'Most of them are going to perish anyway.'
      + '</p>'
    )
    $('div.layer-container').fadeIn('fast', function() {
      $("#retry").show()
    })	
  },
  restart: function() {
    this.click = 0
    this.model.reset()
    $('div.layer-container').fadeOut('fast')
    $('#retry').hide()
    this.render()
  }
})

$(function() {
  $('#start').click(function(){
   $('#instruction').fadeOut('fast', function(){
     var board = new Board({level:1, points:0, life:3})
     new BoardView({el: $('#board-container'), model: board})
   })
  })
})
