# My recent media

in this app, i am displaying the recent films, music and books i have experienced.


## To get recently logged films for a Letterboxd account:
**This API only gives you your last 50 watched films and your lists**
Use URL: `https://recent-media.vercel.app/api/letterboxd?username=${username}` and swap username with the intended username of a letterboxd user.

It uses Letterboxd's RSS feed to fetch a user's recently watched films.

The API returns a JSON-object with these elements for a user:

### Film Details Available

| Variable       | Value                                                                                      |
|----------------|--------------------------------------------------------------------------------------------|
| description    | Watched on Friday January 3, 2025.                                                         |
| title          | The Platform, 2019 - ★★½                                                                  |
| link           |                                                                                            |
| pubDate        | Sat, 4 Jan 2025 07:16:57 +1300                                                            |
| watchedDate    | 2025-01-03                                                                                 |
| rewatch        | No                                                                                         |
| filmTitle      | The Platform                                                                               |
| filmYear       | 2019                                                                                       |
| memberRating   | 2.5                                                                                        |
| imageUrl       | https://a.ltrbxd.com/resized/film-poster/5/4/5/9/8/5/545985-the-platform-0-600-0-900-crop.jpg?v=b3d868a021
| creator        | username  
