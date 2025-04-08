import React from "react";
import { useContext, useState } from "react";
import { ModelContext } from "./modelProvider";
import { getTimestamp, renderDescriptionWithLinks, validateHyperlinks } from "./utils.js";
import { Comments } from "./comment.js";

const Header = ({ postID, views, onAddComment }) => {
    const modelInstance = useContext(ModelContext);
    const post = modelInstance.getPostByID(postID);

    return (
        <div id="post-page-view-header">
            <div className="line">
                <div>{modelInstance.getCommunityByPostID(post.postID).name}</div>
                <div>{getTimestamp(post.postedDate)}</div>
            </div>
            <div className="line post-creator-line">Posted by: {post.postedBy}</div>
            <div className="line post-title">{post.title}</div>
            <div className="line link-flair">
                {modelInstance.getLinkFlairByID(post.linkFlairID).content}
            </div>
            <div className="line post-content">
                {renderDescriptionWithLinks(post.content)}
            </div>
            <div className="line bottom-line">
                <div>Views: {views}</div>
                <div>Comments: {modelInstance.getTotalCommentsForPost(post.postID)}</div>
            </div>
            <button onClick={() => onAddComment(postID)}>Add a comment</button>
        </div>
    );
};

class PostPageView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            views: 0,
        };
    }

    componentDidMount() {
        const modelInstance = this.context;
        const postID = this.props.postID;
        const post = modelInstance.getPostByID(postID);

        if (post) {
            const updatedViews = post.views + 1;
            modelInstance.updatePostViews(postID, updatedViews);
            this.setState({ views: updatedViews });
        }
    }

    render() {
        const modelInstance = this.context;
        const postID = this.props.postID;
        const post = modelInstance.getPostByID(postID);

        if (!post) {
            return <div>ERROR: Post not found.</div>;
        }

        return (
            <div key={postID} id="post-page-view-container">
                <Header 
                    postID={postID} 
                    views={this.state.views} 
                    onAddComment={this.props.onAddComment}
                />
                <Comments postID={postID} onReply={this.props.onReplyComment} />
            </div>
        );
    }
}

PostPageView.contextType = ModelContext;

const NewPostView = ({ onNavigateHome }) => {
  const modelInstance = useContext(ModelContext);

  const [community, setCommunity] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [linkFlair, setLinkFlair] = useState("");
  const [newLinkFlair, setNewLinkFlair] = useState("");
  const [creator, setCreator] = useState("");

  const handleSubmit = () => {
      let errors = "";

      if (!community) {
          errors += "Community selection is required.\n";
      }

      if (title.length === 0) {
          errors += "Title is required.\n";
      } else if (title.length > 100) {
          errors += "Title must be within 100 characters.\n";
      }

      if (content.length === 0) {
          errors += "Content is required.\n";
      }

      if (validateHyperlinks(content).length > 0) {
        errors += validateHyperlinks(content).join('\n');
      }

      if (linkFlair && newLinkFlair.length > 0) {
          errors += "Existing link flair cannot be chosen if you would like to create a new one.\n";
      } else if (newLinkFlair.length > 30) {
          errors += "New Link Flair cannot be more than 30 characters.\n";
      }

      if (creator.length === 0) {
          errors += "Username is required.\n";
      }

      if (errors) {
          window.alert(errors);
      } else {
          const finalLinkFlair = linkFlair
              ? linkFlair
              : newLinkFlair
              ? modelInstance.addLinkFlair(newLinkFlair)
              : "";

          if (!modelInstance.checkIfMemberInCommunity(community, creator)) {
              modelInstance.addMemberToCommunity(community, creator);
          }

          const postID = modelInstance.addPost(title, content, finalLinkFlair, creator);
          modelInstance.addPostToCommunity(postID, community);

          if (onNavigateHome) {
              onNavigateHome();
          }
      }
  };

  const communities = modelInstance.getCommunities();
  const linkFlairs = modelInstance.getLinkFlairs();

  return (
      <div id="new-item-view">
          <div className="bottom-margin" id="new-item-view-header">
              Create a Post:
          </div>
          <div id="new-item-view-elements">
              <div className="new-item-view-element align-center">
                  <h3>Community (required):</h3>
                  <select
                      id="new-post-community-dropdown"
                      value={community}
                      onChange={(e) => setCommunity(e.target.value)}
                  >
                      <option value="" disabled selected hidden>
                          
                      </option>
                      {communities.map((c) => (
                          <option key={c.communityID} value={c.communityID}>
                              {c.name}
                          </option>
                      ))}
                  </select>
              </div>
              <div className="new-item-view-element align-center">
                  <h3>Title (required - no more than 100 characters):</h3>
                  <input
                      id="post-title"
                      className="element-text-box"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                  />
              </div>
              <div id="new-post-link-flair-view">
                  <div className="new-item-view-element">
                      <h3>Link Flair (optional - choose existing or create new):</h3>
                      <label htmlFor="new-post-link-flair-dropdown">Choose Existing Link Flair:</label>
                      <select
                          id="new-post-link-flair-dropdown"
                          value={linkFlair}
                          onChange={(e) => setLinkFlair(e.target.value)}
                          style={{ marginLeft: '5px' }}
                      >
                          <option value="" selected></option>
                          {linkFlairs.map((l) => (
                              <option key={l.linkFlairID} value={l.linkFlairID}>
                                  {l.content}
                              </option>
                          ))}
                      </select>
                  </div>
                  <div>
                      <label htmlFor="new-link-flair-box">New Link Flair (max 30 characters):</label>
                      <input
                          id="new-link-flair-box"
                          className="element-text-box"
                          type="text"
                          value={newLinkFlair}
                          onChange={(e) => setNewLinkFlair(e.target.value)}
                          style={{ marginLeft: '5px' }}
                      />
                  </div>
              </div>
              <div className="new-item-view-element">
                  <h3>Content (required):</h3>
                  <textarea
                      id="post-content"
                      className="element-text-area"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                  />
              </div>
              <div className="new-item-view-element align-center">
                  <h3>Username (required):</h3>
                  <input
                      id="post-creator"
                      className="element-text-box"
                      type="text"
                      value={creator}
                      onChange={(e) => setCreator(e.target.value)}
                  />
              </div>
              <div className="new-item-view-element">
                  <button style={{ marginBottom: '15px' }}id="submit-post-button" onClick={handleSubmit}>
                      Submit Post
                  </button>
              </div>
          </div>
      </div>
  );
};

export { PostPageView, NewPostView };