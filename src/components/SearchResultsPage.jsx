import React, { useState, useEffect } from 'react';

export default function SearchResultsPage({ query, model, onSelectPost }) {
  const [sortOrder, setSortOrder] = useState('newest');
  const [filteredPosts, setFilteredPosts] = useState([]);

  useEffect(() => {
    if (query && query.trim() !== '') {
      setFilteredPosts(model.getPostsByQuery(query));
    } else {
      setFilteredPosts([]);
    }
  }, [query, model]);

  const sortPosts = (arr, order) => {
    const sorted = [...arr];
    if (order === 'newest') {
      sorted.sort((a, b) => b.postedDate - a.postedDate);
    } else if (order === 'oldest') {
      sorted.sort((a, b) => a.postedDate - b.postedDate);
    } else if (order === 'active') {
      sorted.sort((a, b) => {
        const aLast = model.getMostRecentCommentOrPostDate(a.postID);
        const bLast = model.getMostRecentCommentOrPostDate(b.postID);
        return bLast - aLast;
      });
    }
    return sorted;
  };

  const sortedPosts = sortPosts(filteredPosts, sortOrder);

  return (
    <div id="home-view">
      <div id="home-view-header">
        <div id="home-view-header-top-container">
          {sortedPosts.length === 0 ? (
            <div id="home-view-header-title">
              No results for: "{query}"
            </div>
          ) : (
            <div id="home-view-header-title">
              Results for: "{query}"
            </div>
          )}
          <div id="home-view-header-buttons">
            <button onClick={() => setSortOrder('newest')}>Newest</button>
            <button onClick={() => setSortOrder('oldest')}>Oldest</button>
            <button onClick={() => setSortOrder('active')}>Active</button>
          </div>
        </div>
        <div id="home-view-posts-count">
          <p>{sortedPosts.length} posts</p>
        </div>
      </div>

      <div id="home-view-posts">
        {sortedPosts.map((p) => {
          const comm = model.getCommunityByPostID(p.postID);
          const communityName = comm ? comm.name : 'Unknown';
          const timeStamp = model.getTimestamp(p.postedDate);

          return (
            <div
              className="post"
              key={p.postID}
              onClick={() => onSelectPost && onSelectPost(p.postID)}
            >
              <div className="post-top-line">
                <div>{communityName}</div>
                <div>{p.postedBy}</div>
                <div>{timeStamp}</div>
              </div>
              <div className="post-title">{p.title}</div>
              {p.linkFlairID && (
                <div className="link-flair">
                  {model.getLinkFlairByID(p.linkFlairID)?.content}
                </div>
              )}
              <div className="post-text-preview">
                {p.content.length <= 80
                  ? p.content
                  : p.content.substring(0, 80) + '...'}
              </div>
              <div className="post-bottom-line">
                <div>Views: {p.views}</div>
                <div>Comments: {model.getTotalCommentsForPost(p.postID)}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
