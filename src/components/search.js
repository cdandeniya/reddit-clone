import React from "react";
import { useContext } from "react";
import { UnifiedMainView } from "./mainView";
import { ModelContext } from "./modelProvider";

const SearchView = ({ query, onPostClick }) => {
    const modelInstance = useContext(ModelContext);
    const posts = modelInstance.getPostsByQuery(query);
    const postsLength = posts.length;

    const resultsText = postsLength === 0 ? `No results found for: "${query}"` : `Results for: "${query}"`;

    return (
        <>
            <UnifiedMainView 
                posts={posts} 
                text={resultsText} 
                onPostClick={onPostClick} 
            />
        </>
    );
};

export { SearchView };