import React, { useState } from 'react';

function Banner({ onSearch, onCreatePost, onGoHome }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(searchTerm);
    }
  };

  return (
    <div id="banner">
      <div className="left">
        <a
          className="go-home-action"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onGoHome();
          }}
        >
          phreddit
        </a>
      </div>

      <div className="center">
        <input
          id="search-bar"
          type="text"
          placeholder="Search Phreddit..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      </div>

      <div className="right">
        <button
          id="create-post"
          onClick={onCreatePost}
        >
          Create Post
        </button>
      </div>
    </div>
  );
}

export default Banner;
