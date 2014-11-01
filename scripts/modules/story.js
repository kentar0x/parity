// story.js(StoryModule)
var StoryModule = (function() {

  // Variables for the module
  var story;
  var bookmark;

  // Load the story
  var getStory = function() {
    $.getJSON('story.json', function(data) {
      story = data;
      mediator.publish('story_num_levels', getNumLevels());
      mediator.publish('story_story_loaded');
    });
  }

  // Gets the total number of levels in the story
  var getNumLevels = function() {
    var c = 0;
    for(var i=0;i<story.length;++i) {
      if(story[i].type == 'level') {
        ++c;
      }
    }
    return c;
  }

  //Set the bookmark of the current level
  var setBookmark = function(val) {
    bookmark = val;

    //Render it, and save it if it's a playable item
    if(story[bookmark].type == 'instruction') {
      mediator.publish('overlay_render', story[bookmark]);
    }
    else {
      mediator.publish('board_render', story[bookmark]);
      mediator.publish('cookie_data_save', story[bookmark].number);
    }
  }

  // Advances the story
  var advance = function() {
    if(bookmark < story.length-1) {
      setBookmark(++bookmark);
    }
  }

  // Sets the bookmark to the given point
  var setBookmarkAtLevel = function(level) {
    if(level < 0)
      return;
    for(var i=0;i<story.length;++i) {
      if(story[i].number == level) {
        setBookmark(i);
        return;
      }
    }
  }

  // The publicly visible methods are available by this facade
  return {
    getStory: getStory,
    setBookmark: setBookmark,
    setBookmarkAtLevel: setBookmarkAtLevel,
    advance: advance
  }
}())

// Add the mediator to the module
mediator.installTo(StoryModule);

// Subscribe to messages

// Get the story, advance it, and set the bookmark when told
mediator.subscribe('story_get_story', StoryModule.getStory);
mediator.subscribe('story_set_bookmark_at_level',
  StoryModule.setBookmarkAtLevel);
mediator.subscribe('story_advance', StoryModule.advance);

// Advance the story when notified that the current level has been completed
mediator.subscribe('board_level_complete', StoryModule.advance);