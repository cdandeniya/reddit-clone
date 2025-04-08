import React, { useContext } from 'react';
import '../App.js';
import { ModelContext } from './modelProvider.js';

class NavBar extends React.Component {
    render() {
        return (
            <div id="nav-bar">
                <HomeLink
                    currentView={this.props.currentView}
                    onNavigateHome={this.props.onNavigateHome}
                />
                <HomeLinkDivider />
                <CreateCommunityButton
                    currentView={this.props.currentView}
                    onNavigateCreateCommunity={this.props.onNavigateCreateCommunity}
                />
                <CommunityListHeader />
                <CommunityList
                    onNavigateViewCommunity={this.props.onNavigateViewCommunity}
                    currentView={this.props.currentView}
                    activeResourceID={this.props.activeResourceID}
                />
            </div>
        );
    }
}

class HomeLink extends React.Component {
    handleClick = (event) => {
        event.preventDefault();
        if (this.props.onNavigateHome) {
            this.props.onNavigateHome();
        }
    };

    render() {
        const isActive = this.props.currentView === "home";
        return (
            <div className={isActive ? "active" : ""} id="nav-bar-home-link">
                <a href="/#" onClick={this.handleClick}>Home</a>
            </div>
        );
    }
}

class HomeLinkDivider extends React.Component {
    render() {
        return (
            <div className="home-link-line-divider"></div>
        );
    }
}

class CreateCommunityButton extends React.Component {
    handleClick = () => {
        if (this.props.onNavigateCreateCommunity) {
            this.props.onNavigateCreateCommunity();
        }
    };

    render() {
        const isActive = this.props.currentView === "createCommunity";
        return (
            <div id="nav-bar-create-community-button">
                <button className={isActive ? "active" : ""} id="create-community" onClick={this.handleClick}>Create Community</button>
            </div>
        );
    }
}

class CommunityListHeader extends React.Component {
    render() {
        return (
            <div id="nav-bar-communities-header">
                <h3>Communities:</h3>
            </div>
        );
    }
}

const CommunityList = ({ onNavigateViewCommunity, currentView, activeResourceID }) => {
    const modelInstance = useContext(ModelContext);
    const communities = modelInstance.getCommunities();

    const communityList = communities.map((c) => {
    
    const isActive = currentView === 'viewCommunity' && activeResourceID === c.communityID;

        return (
            <li key={c.communityID}>
                <a
                    href="/#"
                    className={isActive ? "active-community-view" : ""}
                    onClick={(e) => {
                        e.preventDefault();
                        if (onNavigateViewCommunity) {
                            onNavigateViewCommunity(c.communityID);
                        }
                    }}
                >
                    {c.name}
                </a>
            </li>
        );
    });

    return (
        <div id="nav-bar-communities-list">
            <ul>{communityList}</ul>
        </div>
    );
};

export { NavBar };