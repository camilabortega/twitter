function loadJSON() {
    return axios.get("feed.json");
}

setTimeout(function () {
    loadJSON()
        .then(function (response) {
            var data = response.data;
            bio(data.user);
            tweets(data.tweets, data.user.info);
            showFeed();
        })
        .catch(function (error) {
            console.log(error);
        });
}, 2000);

function showFeed() {
    var loading = document.querySelector(".loading");
    var hidden = document.querySelectorAll(".hidden");

    loading.className = loading.className + " hidden";

    for (div of hidden) {
        div.className = div.className.replace("hidden", "");
    }
}

function bio(user) {
    var info   = user.info;
    var joined = new Date(info.created_at);
    var months = [
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]

    var followers = info.followers_count;
    
    if(followers >= 1000 && followers <= 999999){
        var k = followers / 1000;
        followers = k.toFixed(1) + "K";
    }

    if(followers >= 1000000){
        var m = followers / 1000000;
        followers = m.toFixed(1) + "M";
    }

    var template = `
        <div class="follow-btn"><a href="#" class="follow">Follow</a></div>
        <h3>${info.name}<img src="icons/verified.svg" alt="Verify"></h3>
        <p class="account">@${info.screen_name}</p>
        <p class="description">${info.description}</p>
        <div class="info">
            <p class="local"><img src="icons/local.svg" alt="Local">${info.location}</p>
            <p class="link"><img src="icons/link.svg" alt="Link"><a href="${info.url.expanded_url}" target="_blank">${info.url.display_url}</a></p>
            <p class="born"><img src="icons/born.svg" alt="Born">Born ${info.born}</p>
        </div>
        <p class="joined"><img src="icons/joined.svg" alt="Joined">Joined ${months[joined.getMonth()]} ${joined.getFullYear()}</p>
        <div class="followers">
            <p><strong>${info.friends_count}</strong> Following</p>
            <p><strong>${followers}</strong> Followers</p>
        </div>
    `;

    var cover   = document.querySelector(".feed .cover");
    var profile = document.querySelector(".feed .profile");
    
    cover.style.backgroundImage = `url(${info.profile_banner})`;
    profile.src = info.profile_image;

    document.querySelector(".bio").innerHTML = template;
}

function tweets(tweets, user) {
    var divTweets = document.querySelector(".tweets");
    var template  = "";

    for(tweet of tweets){

        var date  = new Date(tweet.created_at);
        var media = tweet.media ? tweet.media : false;

        var allMedia = "";        
        if(media){
            for(img of media){
                allMedia += `<div class="media" style="background-image:url(${img})"></div>`;
            }
        }

        template += `
            <div class="tweet">
            <div class="body">
                <div class="avatar"><img src="${user.profile_image}" alt="Avatar"></div>
                <div class="content">
                    <div class="tweet-header">
                        <p>
                            <a href="#"><strong>${user.name}</strong></a>
                            ${user.verified ? '<img src="icons/verified.svg" alt="Verify">' : ''}
                            @${user.screen_name} · ${date.toLocaleDateString()}
                        </p>
                        <img src="icons/embed.svg" alt="More">
                    </div>
                    <p class="tweet-text">${tweet.full_text}</p>
                    ${allMedia !== "" ? `<div class="all-media">${allMedia}</div>` : ""}

                    <div class="reactions">
                        <a class="replies"  href="#">
                            <span class="icon"><i></i></span>
                            <span class="num">${tweet.reply_count}</span>
                        </a>
                        <a class="retweets" href="#">
                            <span class="icon"><i></i></span>
                            <span class="num">${tweet.retweet_count}</span>
                        </a>
                        <a class="likes"    href="#">
                            <span class="icon"><i></i></span>
                            <span class="num">${tweet.favorite_count}</span>
                        </a>
                        <a class="options"  href="#">
                            <span class="icon"><i></i></span>
                        </a>
                    </div>
                </div>
            </div>
            </div>
        `;
    }

    divTweets.innerHTML = template;
}