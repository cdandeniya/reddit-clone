import React, { useContext, useState } from "react";
import { validateHyperlinks, calculateDescriptionLength, getTimestamp, sortPosts, renderDescriptionWithLinks } from "./utils";
import { ModelContext } from "./modelProvider";
import { ViewBodyPosts } from "./mainView";

const NewCommunityView = ({ onNavigateHome }) => {
    const [communityName, setCommunityName] = useState("");
    const [communityDescription, setCommunityDescription] = useState("");
    const [communityCreator, setCommunityCreator] = useState("");
    const modelInstance = useContext(ModelContext);

    const handleCreateCommunity = () => {
        let validationErrors = "";

        if (communityName.length > 100) {
            validationErrors += "Community name must be within 100 characters.\n";
        }
        if (communityName.length === 0) {
            validationErrors += "Community name must be present.\n";
        }

        const hyperlinkErrors = validateHyperlinks(communityDescription);
        if (hyperlinkErrors.length > 0) {
            validationErrors += hyperlinkErrors.join("\n");
        }

        const descriptionLength = calculateDescriptionLength(communityDescription);
        if (descriptionLength > 500) {
            validationErrors += "Community description must be within 500 characters, excluding hyperlink targets.\n";
        }

        if (communityCreator.length === 0) {
            validationErrors += "Community creator must be present.";
        }

        if (validationErrors.length !== 0) {
            window.alert(validationErrors);
        } else {
            let commID = `community${modelInstance.getCommunities().length + 1}`;

            modelInstance.addCommunity({
                communityID: commID,
                name: communityName,
                description: communityDescription,
                postIDs: [],
                startDate: new Date(),
                members: [communityCreator],
                memberCount: 1
            });

            setCommunityName("");
            setCommunityDescription("");
            setCommunityCreator("");

            if (onNavigateHome) {
                onNavigateHome();
            }
        }
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
                    value={communityName}
                    onChange={(e) => setCommunityName(e.target.value)}
                />
            </div>
            <div className="new-item-view-element">
                <h3>Community Description (required - no more than 500 characters):</h3>
                <textarea
                    id="community-description"
                    className="element-text-area"
                    value={communityDescription}
                    onChange={(e) => setCommunityDescription(e.target.value)}
                />
            </div>
            <div className="new-item-view-element">
                <h3>Community Creator (required):</h3>
                <input
                    id="community-creator"
                    className="element-text-box"
                    type="text"
                    value={communityCreator}
                    onChange={(e) => setCommunityCreator(e.target.value)}
                />
            </div>
            <div className="new-item-view-element">
                <button onClick={handleCreateCommunity}>Engender Community</button>
            </div>
        </div>
    );
};

const CommunityView = ({ communityID, onPostClick }) => {
    const modelInstance = useContext(ModelContext);
    const community = modelInstance.getCommunityByID(communityID);
    const posts = modelInstance.getPostsByCommunityID(communityID);

    const [sortOrder, setSortOrder] = useState("newest");
    const sortedPosts = sortPosts([...posts], sortOrder, modelInstance);

    if (!community) {
        return <div>Community not found.</div>;
    }

    return (
        <div id="home-view">
            <div id="home-view-header">
                <div id="home-view-header-top-container">
                    <div id="home-view-header-title">{community.name}</div>
                    <div id="home-view-header-buttons">
                        <button onClick={() => setSortOrder("newest")}>Newest</button>
                        <button onClick={() => setSortOrder("oldest")}>Oldest</button>
                        <button onClick={() => setSortOrder("active")}>Active</button>
                    </div>
                </div>
                <div id="home-view-posts-count">
                    <p>{renderDescriptionWithLinks(community.description)}</p>
                </div>
                <div id="community-view-age">
                    Created {getTimestamp(community.startDate)}
                </div>
                <div id="community-view-post-count">
                    {community.postIDs.length} {community.postIDs.length === 1 ? "post" : "posts"}  |  {community.memberCount} {community.memberCount === 1 ? "member" : "members"}
                </div>
            </div>
            <ViewBodyPosts posts={sortedPosts} onPostClick={onPostClick}  />
        </div>
    );
};

export { NewCommunityView, CommunityView };