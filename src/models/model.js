export default class Model {
    constructor() {
        this.data = {
            communities: [ //array of community objects
                {// community object 1
                    communityID: 'community1',
                    name: 'Am I the Jerk?',
                    description: 'A practical application of the principles of justice.',
                    postIDs: ['p1'],
                    startDate: new Date('August 10, 2014 04:18:00'),
                    members: ['rollo', 'shemp', 'catlady13', 'astyanax', 'trucknutz69'],
                    memberCount: 5,
                },
                { // community object 2
                    communityID: 'community2',
                    name: 'The History Channel',
                    description: 'A fantastical reimagining of our past and present.',
                    postIDs: ['p2'],
                    startDate: new Date('May 4, 2017 08:32:00'),
                    members: ['MarcoArelius', 'astyanax', 'outtheretruth47', 'bigfeet'],
                    memberCount: 4,
                }
            ],
            linkFlairs: [ // array of link flair objects
                { // link flair 1
                    linkFlairID: 'lf1',
                    content: 'The jerkstore called...', 
                },
                { //link flair 2
                    linkFlairID: 'lf2',
                    content: 'Literal Saint',
                },
                { //link flair 3
                    linkFlairID: 'lf3',
                    content: 'The walk among us',
                },
                { //link flair 4
                    linkFlairID: 'lf4',
                    content: 'Worse than Hitler',
                },
            ],
            posts: [ // array of post objects
                { // post 1
                    postID: 'p1',
                    title: 'AITJ: I parked my cybertruck in the handicapped spot to protect it from bitter, jealous losers.',
                    content: 'Recently I went to the store in my brand new Tesla cybertruck. I know there are lots of haters out there, so I wanted to make sure my truck was protected. So I parked it so it overlapped with two of those extra-wide handicapped spots.  When I came out of the store with my beef jerky some Karen in a wheelchair was screaming at me.  So tell me prhreddit, was I the jerk?',
                    linkFlairID: 'lf1',
                    postedBy: 'trucknutz69',
                    postedDate: new Date('August 23, 2024 01:19:00'),
                    commentIDs: ['comment1', 'comment2'],
                    views: 14,
                },
                { // post 2
                    postID: 'p2',
                    title: "Remember when this was a HISTORY channel?",
                    content: 'Does anyone else remember when they used to show actual historical content on this channel and not just an endless stream of alien encounters, conspiracy theories, and cryptozoology? I do.\n\nBut, I am pretty sure I was abducted last night just as described in that show from last week, "Finding the Alien Within".  Just thought I\'d let you all know.',
                    linkFlairID: 'lf3',
                    postedBy: 'MarcoArelius',
                    postedDate: new Date('September 9, 2024 14:24:00'),
                    commentIDs: ['comment4', 'comment5'],
                    views: 1023,
                },
            ],
            comments: [ //array of comment objects
                { // comment 1
                    commentID: 'comment1',
                    content: 'There is no higher calling than the protection of Tesla products.  God bless you sir and God bless Elon Musk. Oh, NTJ.',
                    commentIDs: ['comment3'],
                    commentedBy: 'shemp',
                    commentedDate: new Date('August 23, 2024 08:22:00'),
                },
                { // comment 2
                    commentID: 'comment2',
                    content: 'Obvious rage bait, but if not, then you are absolutely the jerk in this situation. Please delete your Tron vehicle and leave is in peace.  YTJ.',
                    commentIDs: [],
                    commentedBy: 'astyanax',
                    commentedDate: new Date('August 23, 2024 10:57:00'),
                },
                { // comment 3
                    commentID: 'comment3',
                    content: 'My brother in Christ, are you ok? Also, YTJ.',
                    commentIDs: [],
                    commentedBy: 'rollo',
                    commentedDate: new Date('August 23, 2024 09:31:00'),
                },
                { // comment 4
                    commentID: 'comment4',
                    content: 'The truth is out there.',
                    commentIDs: ['comment6'],
                    commentedBy: "astyanax",
                    commentedDate: new Date('September 10, 2024 6:41:00'),
                },
                { // comment 5
                    commentID: 'comment5',
                    content: 'The same thing happened to me. I guest this channel does still show real history.',
                    commentIDs: [],
                    commentedBy: 'bigfeet',
                    commentedDate: new Date('September 09, 2024 017:03:00'),
                },
                { // comment 6
                    commentID: 'comment6',
                    content: 'I want to believe.',
                    commentIDs: ['comment7'],
                    commentedBy: 'outtheretruth47',
                    commentedDate: new Date('September 10, 2024 07:18:00'),
                },
                { // comment 7
                    commentID: 'comment7',
                    content: 'Generic poster slogan #42',
                    commentIDs: [],
                    commentedBy: 'bigfeet',
                    commentedDate: new Date('September 10, 2024 09:43:00'),
                },
            ],
        }; //end this.data object
    } // end constructor()

    getCommunities() {
        return this.data.communities;
    }

    getCommunityByID(id) {
        return this.data.communities.find(c => c.communityID === id);
    }

    getCommunityByPostID(id) {
        return this.data.communities.find(c => c.postIDs.includes(id));
    }

    getPosts() {
        return this.data.posts;
    }

    getPostByID(id) {
        return this.data.posts.find(p => p.postID === id);
    }

    getPostsByQuery(query) {
        if (query === "") {
          return [];
        }

        const posts = this.getPosts();
      
        const queryElements = query.toLowerCase().split(" ");
        const filteredPosts = [];
      
        posts.forEach(p => {
          const titleElements = p.title.toLowerCase().split(" ");
          const contentElements = p.content.toLowerCase().split(" ");
      
          const isMatch = queryElements.some(q => titleElements.includes(q) || contentElements.includes(q));
      
          if (isMatch) {
            filteredPosts.push(p);
            return;
          }
      
          for (let cID of p.commentIDs) {
            const comment = this.data.comments.find(c => c.commentID === cID);
            if (comment) {
              const commentElements = comment.content.toLowerCase().split(" ");
              if (queryElements.some(q => commentElements.includes(q))) {
                filteredPosts.push(p);
                break;
              }
            }
          }
        });
      
        return filteredPosts;
    }

    getPostsByCommunityID(id) {
        return this.data.posts.filter(p => this.getCommunityByID(id).postIDs.includes(p.postID));
    }

    getLinkFlairs() {
        return this.data.linkFlairs;
    }

    getLinkFlairByID(id) {
        return this.data.linkFlairs.find(l => l.linkFlairID === id);
    }

    addLinkFlair(content) {
        const id = `lf${this.getLinkFlairs().length + 1}`;
        this.data.linkFlairs.push({
            linkFlairID: id,
            content: content
        });
        return id;
    }

    addCommunity(obj) {
        this.data.communities.push(obj);
    }

    addPost(title, content, linkFlairID, postedBy) {
        let postID = `p${this.getPosts().length + 1}`;
        this.data.posts.push({
            postID: postID,
            title: title,
            content: content,
            linkFlairID: linkFlairID,
            postedBy: postedBy,
            postedDate: new Date(),
            commentIDs: [],
            views: 0
        })
        return postID;
    }

    updatePostViews(postID, views) {
        this.data.posts.find(p => p.postID === postID).views = views;
    }

    addPostToCommunity(postID, communityID) {
        this.getCommunityByID(communityID).postIDs.push(postID);
    }

    addMemberToCommunity(communityID, name) {
        this.getCommunityByID(communityID).members.push(name);
        this.getCommunityByID(communityID).memberCount += 1;
    }

    getNestedCommentsInNewestOrder(postID) {
        const post = this.getPostByID(postID);
        if (!post) {
            return [];
        }
    
        const getCommentsRecursively = (commentIDs) => {
            let comments = commentIDs.map(commentID => {
                const comment = this.data.comments.find(c => c.commentID === commentID);
                if (comment) {
                    return {
                        ...comment,
                        nestedComments: getCommentsRecursively(comment.commentIDs)
                    };
                }
                return null;
            }).filter(comment => comment !== null);
            
            comments.sort((a, b) => new Date(b.commentedDate) - new Date(a.commentedDate));
            return comments;
        };
    
        return getCommentsRecursively(post.commentIDs);
    }
    

    getCommentByID(commentID) {
        return this.data.comments.find(c => c.commentID === commentID);
    }

    addCommentIDToPost(commentID, postID) {
        this.getPostByID(postID).commentIDs.push(commentID);
    }

    addCommentIDToComment(parentCommentID, childCommentID) {
        this.getCommentByID(parentCommentID).commentIDs.push(childCommentID);
    }

    getComments() {
        return this.data.comments;
    }

    addComment(content, commentedBy) {
        const id = `comment${this.getComments().length + 1}`;
        this.data.comments.push({
            commentID: id,
            content: content,
            commentIDs: [],
            commentedBy: commentedBy,
            commentedDate: new Date()
        });

        return id;
    }
    
    checkIfMemberInCommunity(communityID, memberName) {
        return this.getCommunityByID(communityID).members.includes(memberName);
    }

    getTotalCommentsForPost(postID) {
        const post = this.getPostByID(postID);
        if (!post) {
            return 0;
        }
    
        const countCommentsRecursively = (commentIDs) => {
            let count = commentIDs.length;
            commentIDs.forEach(commentID => {
                const comment = this.getCommentByID(commentID);
                if (comment) {
                    count += countCommentsRecursively(comment.commentIDs);
                }
            });
            return count;
        };
    
        return countCommentsRecursively(post.commentIDs);
    }

    incrementPostView(postID) {
        this.data.posts.views += 1;
    }

    getCommunityMemberCount(communityID) {
        return this.getCommunityByID(communityID).memberCount;
    }

    getPostIDByCommentID(commentID) {
        for (const post of this.data.posts) {
            if (post.commentIDs.includes(commentID)) {
                return post.postID;
            }
        }
        
        const findInNestedComments = (parentCommentID) => {
            const comment = this.getCommentByID(parentCommentID);
            if (!comment) return null;
            
            if (comment.commentIDs.includes(commentID)) {
                return true;
            }
            
            for (const childCommentID of comment.commentIDs) {
                if (findInNestedComments(childCommentID)) {
                    return true;
                }
            }
            
            return false;
        };
        
        for (const post of this.data.posts) {
            for (const directCommentID of post.commentIDs) {
                if (findInNestedComments(directCommentID)) {
                    return post.postID;
                }
            }
        }
        
        return null;
    }
} // end Model