Board = Backbone.Model.extend({
  initialize: function(info) {
    this.level = info.level
    this.points = info.points
    this.life = info.life
    this.pattern = this.getPattern()
    _.bindAll(this)
  },
  getPattern: function() {
    var path = new Array()
    if(this.level <= 13) {
      var filledTiles = Math.max(this.level, 4)
      if(this.level >= 1 && this.level <=3) {
        path.length = 3
      } else if(this.level >= 4 && this.level <= 7) {
        path.length = 4
      } else {
        path.length = 5
      }
    } else {
      path.length = 5
      var filledTiles = 13
    }
    for (i = 0; i < path.length; i++) {
      path[i] = new Array(path.length)
      for (c = 0; c < path[i].length; c++)
        path[i][c] = 0
    }
    for (i = 0; i < filledTiles; i++)
      this.fillTiles(path)
    return { path: path, filledTiles : filledTiles }
  },
  fillTiles: function(path) {
    var randRow = Math.floor(Math.random() * path.length)
    var randEl = Math.floor(Math.random() * path[randRow].length)
    if(path[randRow][randEl] == 0) {
      path[randRow][randEl] = 1
    } else {
      this.fillTiles(path)
    }
  },    
  getNextLevel : function() {
    this.level += 1
    this.points += this.pattern.filledTiles
    this.pattern = this.getPattern()  
  },
  penalty : function() {
    this.points = this.points > 1 ? Math.floor(this.points/100*80) : this.points
  },
  reset : function() {
    this.points = 0
    this.level = 1
    this.life = 3
    this.pattern = this.getPattern()
  }
})
