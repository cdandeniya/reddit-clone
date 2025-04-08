import React from "react";
import { useContext, useState } from "react";
import { ModelContext } from "./modelProvider";
import { validateHyperlinks, renderDescriptionWithLinks, getTimestamp } from "./utils";

const Comment = ({ comment, postID, getTimestamp, onReply }) => {
  return (
    <div className="comment">
      <div className="comment-content">
        <div className="top-line">
          <div id="username">{comment.commentedBy}</div>
          <div id="timestamp">{getTimestamp(comment.commentedDate)}</div>
        </div>
        <div className="content">
          {renderDescriptionWithLinks(comment.content)}
        </div>
        <div id="reply-button">
          <button onClick={() => onReply(comment.commentID, postID)}>Reply</button>
        </div>
      </div>
      {comment.nestedComments && comment.nestedComments.length > 0 && (
        <div className="nested-comments">
          {comment.nestedComments.map((nestedComment) => (
            <Comment
              key={nestedComment.commentID}
              comment={nestedComment}
              postID={postID}
              getTimestamp={getTimestamp}
              onReply={onReply}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Comments = ({ postID, onReply }) => {
    const modelInstance = useContext(ModelContext);
    const nestedComments = modelInstance.getNestedCommentsInNewestOrder(postID);

    return (
        <div id="post-page-view-comments">
            {nestedComments.map((comment) => (
                <Comment
                    key={comment.commentID}
                    comment={comment}
                    postID={postID}
                    getTimestamp={getTimestamp}
                    onReply={(commentID) => onReply(commentID, postID)} // pass both commentID and postID
                />
            ))}
        </div>
    );
};

const NewCommentView = ({ currentView, activeResourceID, onSubmitSuccess }) => {
    const [commentContent, setCommentContent] = useState("");
    const [commentCreator, setCommentCreator] = useState("");
    const modelInstance = useContext(ModelContext);

    const handleSubmit = () => {
        let errors = "";

        if (commentContent.length === 0) {
            errors += "Comment content is required.\n";
        } else if (commentContent.length > 500) {
            errors += "Comment content must be within 500 characters.\n";
        }

        const hyperlinkErrors = validateHyperlinks(commentContent);
        if (hyperlinkErrors.length > 0) {
          errors += hyperlinkErrors.join('\n');
        }

        if (commentCreator.length === 0) {
            errors += "Username is required.\n";
        }

        if (errors) {
            window.alert(errors);
            return;
        }

        const commentID = modelInstance.addComment(commentContent, commentCreator);
        
        if (currentView === "createComment") {
            modelInstance.addCommentIDToPost(commentID, activeResourceID);
        } 
        else if (currentView === "replyComment") {
            modelInstance.addCommentIDToComment(activeResourceID, commentID);
        }

        setCommentContent("");
        setCommentCreator("");
        
        if (onSubmitSuccess) {
            onSubmitSuccess();
        }
    };

    return (
        <div id="new-item-view">
            <div className="bottom-margin" id="new-item-view-header">
                Create or Reply to a Comment:
            </div>
            <div className="new-item-view-element">
                <h3>Comment Content (required - no more than 500 characters):</h3>
                <textarea 
                    id="comment-content" 
                    className="element-text-area"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                ></textarea>
            </div>
            <div className="new-item-view-element">
                <h3>Username (required):</h3>
                <input 
                    id="comment-creator" 
                    className="element-text-box" 
                    type="text"
                    value={commentCreator}
                    onChange={(e) => setCommentCreator(e.target.value)}
                />
            </div>
            <div className="new-item-view-element">
                <button onClick={handleSubmit}>Submit Comment</button>
            </div>
        </div>
    );
};

export { Comment, Comments, NewCommentView};