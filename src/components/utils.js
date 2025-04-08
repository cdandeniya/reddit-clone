import React from "react";

function getTimestamp(dt) {
    if (!(dt instanceof Date)) {
        throw new Error("getTimestamp(dt): invalid input - expected a Date object.");
    }

    const currentDate = new Date();
    const diffInSeconds = Math.floor((currentDate - dt) / 1000);

    if (diffInSeconds < 60) {
        return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }

    let months = (currentDate.getFullYear() - dt.getFullYear()) * 12 + (currentDate.getMonth() - dt.getMonth());
    if (months < 12) {
        return `${months} month${months !== 1 ? 's' : ''} ago`;
    }

    let years = currentDate.getFullYear() - dt.getFullYear();
    return `${years} year${years !== 1 ? 's' : ''} ago`;
}

function parseHyperlinks(text) {
    const links = [];
    let index = 0;

    while (index < text.length) {
      const openBracket = text.indexOf("[", index);
      if (openBracket === -1) break;

      const closeBracket = text.indexOf("]", openBracket);
      if (closeBracket === -1) break;

      const openParen = text.indexOf("(", closeBracket);
      if (openParen === -1) break;

      const closeParen = text.indexOf(")", openParen);
      if (closeParen === -1) break;
  
      links.push({
        start: openBracket,
        end: closeParen + 1,
        linkText: text.substring(openBracket + 1, closeBracket),
        linkHref: text.substring(openParen + 1, closeParen),
      });
  
      index = closeParen + 1;
    }
    return links;
  }
  
  function validateTextWithLinks(text) {
    const errors = [];
    const links = parseHyperlinks(text);
  
    links.forEach((link) => {
      if (!link.linkText.trim()) {
        errors.push("Hyperlink text (inside []) cannot be empty.");
      }
      validateUrl(link.linkHref, errors);
    });
  
    return errors;
  }
  
  function validateUrl(url, errors) {
    if (!url || !url.trim()) {
      errors.push("Hyperlink target (inside ()) cannot be empty.");
      return;
    }
  
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      errors.push(`Invalid URL: "${url}". Must start with 'http://' or 'https://'.`);
      return;
    }
  
    if (url.startsWith("http:") && !url.startsWith("http://")) {
      errors.push(
        `Invalid URL: "${url}". Protocol 'http:' must be followed by '//'.`
      );
      return;
    }
    if (url.startsWith("https:") && !url.startsWith("https://")) {
      errors.push(
        `Invalid URL: "${url}". Protocol 'https:' must be followed by '//'.`
      );
      return;
    }
  
    let domainPart = "";
    if (url.startsWith("http://")) {
      domainPart = url.substring(7);
    } else if (url.startsWith("https://")) {
      domainPart = url.substring(8);
    }
    if (!domainPart.includes(".")) {
      errors.push(`Invalid URL: "${url}". Domain must contain a dot.`);
      return;
    }
  }
  
  function renderTextWithLinks(text) {
    const parts = [];
    let lastIndex = 0;
    const links = parseHyperlinks(text);
  
    links.forEach((link) => {
      if (link.start > lastIndex) {
        parts.push(text.substring(lastIndex, link.start));
      }
  
      parts.push(
        <a key={link.start} href={link.linkHref} target="_blank" rel="noreferrer">
          {link.linkText}
        </a>
      );
  
      lastIndex = link.end;
    });
  
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }
  
    return <>{parts}</>;
  }
  
  function calcTextWithLinksLength(text) {
    let calculatedLength = 0;
    let lastIndex = 0;
    const links = parseHyperlinks(text);
  
    links.forEach((link) => {
      calculatedLength += text.substring(lastIndex, link.start).length;
      calculatedLength += link.linkText.length;
      lastIndex = link.end;
    });
  
    calculatedLength += text.substring(lastIndex).length;
    return calculatedLength;
  }
  
  function sortPosts(posts, order, modelInstance) {
    if (order === "newest") {
      posts = posts.sort(
        (a, b) => new Date(b.postedDate) - new Date(a.postedDate)
      );
    } else if (order === "oldest") {
      posts = posts.sort(
        (a, b) => new Date(a.postedDate) - new Date(b.postedDate)
      );
    } else if (order === "active") {
      posts = posts.sort((a, b) => {
        const aSort = mostActivePostSortingHelper(a, modelInstance);
        const bSort = mostActivePostSortingHelper(b, modelInstance);
        if (bSort.primary !== aSort.primary) {
          return bSort.primary - aSort.primary;
        }
        return bSort.secondary - aSort.secondary;
      });
    }
    return posts;
  }
  
  function mostActivePostSortingHelper(post, modelInstance) {
    if (!post) {
      return { primary: 0, secondary: 0 };
    }
  
    const postTime = new Date(post.postedDate).getTime();
    let mostRecentCommentTime = 0;
  
    if (post.commentIDs.length > 0) {
      const comments = modelInstance
        .getComments()
        .filter((comment) => post.commentIDs.includes(comment.commentID));
      mostRecentCommentTime = comments.reduce((latest, comment) => {
        const commentTime = new Date(comment.commentedDate).getTime();
        return commentTime > latest ? commentTime : latest;
      }, 0);
    }
  
    const primary = mostRecentCommentTime > postTime ? mostRecentCommentTime : postTime;
    const secondary = postTime;
  
    return { primary, secondary };
  }
  
  export {
    getTimestamp,
    validateTextWithLinks as validateHyperlinks,
    renderTextWithLinks as renderDescriptionWithLinks,
    calcTextWithLinksLength as calculateDescriptionLength,
    sortPosts,
  };