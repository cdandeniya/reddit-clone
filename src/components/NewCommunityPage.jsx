import React, { useState } from 'react';

export default function NewCommunityPage({ model, onCommunityCreated }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creator, setCreator] = useState('');
  const [errors, setErrors] = useState([]);

  const validate = () => {
    const e = [];
    if (!name) e.push('Community name is required.');
    else if (name.length > 100) e.push('Name must be <= 100 characters.');

    if (!description) e.push('Description is required.');
    else if (description.length > 500) e.push('Description must be <= 500 characters.');

    if (!creator) e.push('Creator username is required.');
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (e.length) {
      setErrors(e);
      return;
    }

    const newID = `community${model.getCommunities().length + 1}`;
    model.addCommunity({
      communityID: newID,
      name,
      description,
      postIDs: [],
      startDate: new Date(),
      members: [creator],
      memberCount: 1
    });

    onCommunityCreated(newID);
  };

  return (
    <div id="new-item-view">
      <div className="bottom-margin" id="new-item-view-header">
        Create a Community:
      </div>

      <div className="new-item-view-element">
        <h3>Community Name (required - no more than 100 characters):</h3>
        <input
          id="community-name"
          className="element-text-box"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="new-item-view-element">
        <h3>Community Description (required - no more than 500 characters):</h3>
        <textarea
          id="community-description"
          className="element-text-area"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="new-item-view-element">
        <h3>Community Creator (required):</h3>
        <input
          id="community-creator"
          className="element-text-box"
          type="text"
          value={creator}
          onChange={(e) => setCreator(e.target.value)}
        />
      </div>

      {errors.length > 0 && (
        <div style={{ color: 'red' }}>
          {errors.map((msg, idx) => <div key={idx}>{msg}</div>)}
        </div>
      )}

      <div className="new-item-view-element">
        <button onClick={handleSubmit}>
          Engender Community
        </button>
      </div>
    </div>
  );
}
