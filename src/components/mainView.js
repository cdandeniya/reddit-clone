import React, { useContext, useState } from 'react';
import { ModelContext } from './modelProvider.js';
import PostView from './post.js';
import { sortPosts } from './utils';

export function UnifiedMainView({ onPostClick }) {
    const modelInstance = useContext(ModelContext);
    const posts = modelInstance.getPosts();
    const [sortOrder, setSortOrder] = useState("newest");

    const sortedPosts = sortPosts([...posts], sortOrder, modelInstance);

    return (
        <div id="home-view">
            <Header 
                text="All Posts" 
                sortOrder={sortOrder} 
                onSortChange={setSortOrder} 
                posts={sortedPosts}
            />
            <ViewBodyPosts posts={sortedPosts} onPostClick={onPostClick} />
        </div>
    );
}

class Header extends React.Component {
    render() {
        const { onSortChange, posts } = this.props;
        return (
            <div id="home-view-header">
                <div id="home-view-header-top-container">
                    <div id="home-view-header-title">
                        {this.props.text || "All Posts"}
                    </div>
                    <div id="home-view-header-buttons">
                        <button 
                            onClick={() => onSortChange("newest")}
                        >
                            Newest
                        </button>
                        <button 
                            onClick={() => onSortChange("oldest")}
                        >
                            Oldest
                        </button>
                        <button 
                            onClick={() => onSortChange("active")}
                        >
                            Active
                        </button>
                    </div>
                </div>
                <PostCount posts={posts} />
            </div>
        );
    }
}

const PostCount = ({ posts }) => {
    return (
        <div id="home-view-posts-count">
            <p>{posts.length === 1 ? "1 post" : `${posts.length} posts`}</p>
        </div>
    );
};

const ViewBodyPosts = ({ posts, onPostClick }) => {
    return (
        <div id="home-view-posts">
            {posts.map(post => (
                <PostView 
                    key={`${post.postID}-${post.views}`}
                    post={post} 
                    onClick={() => onPostClick(post.postID)} 
                />
            ))}
        </div>
    );
};

export { Header, ViewBodyPosts };