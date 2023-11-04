const isYouTubeVideoLink = (url) => {
    const linkPattern = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;


    return linkPattern.test(url);
}

module.exports = {isYouTubeVideoLink};

