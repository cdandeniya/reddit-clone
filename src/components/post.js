import React, { useContext } from "react";
import { getTimestamp, renderDescriptionWithLinks } from "../components/utils.js";
import { ModelContext } from "./modelProvider";

const PostView = ({ post, onClick }) => {
    const modelInstance = useContext(ModelContext);
    return (
        <div className="post" onClick={onClick}>
            <div className="post-top-line">
                <div>{modelInstance.getCommunityByPostID(post.postID).name}</div>
                <div>{post.postedBy}</div>
                <div>{getTimestamp(post.postedDate)}</div>
            </div>
            <div className="post-title">
                {post.title}
            </div>
            {post.linkFlairID && (
                <div className="link-flair">
                    {modelInstance.getLinkFlairByID(post.linkFlairID).content}
                </div>
            )}
            <div className="post-text-preview">
                {renderDescriptionWithLinks(
                    post.content.length <= 80 ? post.content : post.content.substring(0, 80) + "..."
                )}
            </div>
            <div className="post-bottom-line">
                <div>
                    Views: {post.views}
                </div>
                <div>
                    Comments: {modelInstance.getTotalCommentsForPost(post.postID)}
                </div>
            </div>
        </div>
    );
};

export default PostView;