// import './stylesheets/App.css';
import './stylesheets/index.css';
import React, { useState } from 'react';

import { Banner } from './components/banner.js';
import { NavBar } from './components/navbar.js';
import { UnifiedMainView } from './components/mainView.js';
import { SearchView } from './components/search.js';
import ModelProvider from './components/modelProvider.js';
import { PostPageView, NewPostView } from './components/postPage.js';
import { NewCommunityView, CommunityView } from './components/community.js';
import { NewCommentView } from './components/comment.js';

// views:
// home, community, post, search

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeResourceID, setActiveResourceID] = useState(null);
  const [parentPostID, setParentPostID] = useState(null);

  const handleNavigateHome = () => {
    setCurrentView('home');
  };

  const handleNavigateSearch = (query) => {
    setSearchQuery(query);
    setCurrentView('search');
  };

  const handlePostClick = (postID) => {
    setActiveResourceID(postID);
    setCurrentView('post');
  };

  const handleNavigateCreateCommunity = () => {
    setCurrentView('createCommunity');
  };

  const handleNavigateCreatePost = () => {
    setCurrentView('createPost');
  };

  const handleNavigateViewCommunity = (communityID) => {
    setCurrentView('viewCommunity');
    setActiveResourceID(communityID);
  };

  const handleNavigateReplyComment = (commentID, postID) => {
    setActiveResourceID(commentID); 
    setParentPostID(postID);
    setCurrentView('replyComment');
  };

  const handleAddComment = (postID) => {
    setActiveResourceID(postID);
    setCurrentView("createComment");
  };

  const renderCurrentView = () => {
    if (currentView === 'search') {
      return <SearchView query={searchQuery} onPostClick={handlePostClick} />;
    } 
    else if (currentView === 'post' && activeResourceID) {
      return <PostPageView 
        postID={activeResourceID} 
        onAddComment={handleAddComment} 
        onReplyComment={handleNavigateReplyComment} 
      />;
    } 
    else if (currentView === 'createCommunity') {
      return <NewCommunityView onNavigateHome={handleNavigateHome} />;
    } 
    else if (currentView === 'createPost') {
      return <NewPostView onNavigateHome={handleNavigateHome} />;
    }
    else if (currentView === 'viewCommunity') {
      return <CommunityView communityID={activeResourceID} onPostClick={handlePostClick} />;
    }
    else if (currentView === 'createComment' || currentView === 'replyComment') {
      return (
        <NewCommentView 
          currentView={currentView} 
          activeResourceID={activeResourceID}
          onSubmitSuccess={() => {
            // if replying to a comment, reset activeResourceID to the parent post ID
            if (currentView === 'replyComment') {
              setActiveResourceID(parentPostID);
            }
            setCurrentView('post');
          }}
        />
      );
    }
    else {
      return <UnifiedMainView onPostClick={handlePostClick} />;
    }
  };

  return (
    <ModelProvider>
      <Banner 
        onNavigateHome={handleNavigateHome} 
        onNavigateSearch={handleNavigateSearch} 
        onNavigateCreatePost={handleNavigateCreatePost} 
        currentView={currentView}
      />
      <div id="content-container">
        <NavBar 
          onNavigateHome={handleNavigateHome} 
          onNavigateCreateCommunity={handleNavigateCreateCommunity}
          onNavigateViewCommunity={handleNavigateViewCommunity} 
          currentView={currentView}
          activeResourceID={activeResourceID}
        />
        <div id="main-content-view">
          {renderCurrentView()}
        </div>
      </div>
    </ModelProvider>
  );
}

export default App;
