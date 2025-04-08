import React, { useState } from 'react';

export default function NewCommentPage({
  model,
  postID,
  parentCommentID,
  onCommentCreated
}) {
  const [content, setContent] = useState('');
  const [username, setUsername] = useState('');
  const [errors, setErrors] = useState([]);

  const validate = () => {
    const e = [];
    if (!content) {
      e.push('Comment content is required.');
    } else if (content.length > 500) {
      e.push('Comment cannot exceed 500 characters.');
    }
    if (!username) {
      e.push('Username is required.');
    }
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (e.length) {
      setErrors(e);
      return;
    }

    const communityID = model.getCommunityByPostID(postID)?.communityID;
    if (communityID && !model.checkIfMemberInCommunity(communityID, username)) {
      model.addMemberToCommunity(communityID, username);
    }

    const newCID = model.addComment(content, username);
    if (parentCommentID) {
      model.addCommentIDToComment(parentCommentID, newCID);
    } else {
      model.addCommentIDToPost(newCID, postID);
    }

    onCommentCreated(postID);
  };

  return (
    <div id="new-item-view">
      <div className="bottom-margin" id="new-item-view-header">
        {parentCommentID
          ? 'Reply to a Comment:'
          : 'Add a New Comment:'}
      </div>

      <div className="new-item-view-element">
        <h3>Comment Content (required - no more than 500 characters):</h3>
        <textarea
          id="comment-content"
          className="element-text-area"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <div className="new-item-view-element">
        <h3>Username (required):</h3>
        <input
          id="comment-creator"
          className="element-text-box"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((err, idx) => <div key={idx}>{err}</div>)}
        </div>
      )}

      <div className="new-item-view-element">
        <button onClick={handleSubmit}>Submit Comment</button>
      </div>
    </div>
  );
}
